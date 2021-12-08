const fs = require("fs");
const path = require("path");
const { Client, Intents, Collection } = require("discord.js");
const configuration = require("./config.json");
const { token } = require("./secrets.json");
const signale = require("./helpers/logger");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const embedFormatter = require("./utils/embed-formatter");
const { getConfig } = require("./helpers/server-config");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.on("raw", (packet) => {
  if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t)) return;
  const channel = client.channels.cache.get(packet.d.channel_id);
  // There's no need to emit if the message is cached, because the event will fire anyway for that
  if (channel.messages.cache.has(packet.d.message_id)) return;
  // Since we have confirmed the message is not cached, let's fetch it
  channel.messages.fetch(packet.d.message_id).then((message) => {
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
    // This gives us the reaction we need to emit the event properly, in top of the message object
    const reaction = message.reactions.cache.get(emoji);
    // Adds the currently reacting user to the reaction's users collection.
    if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
    // Check which type of event it is before emitting
    if (packet.t === "MESSAGE_REACTION_ADD") {
      client.emit("messageReactionAdd", reaction, client.users.cache.get(packet.d.user_id));
    }
    if (packet.t === "MESSAGE_REACTION_REMOVE") {
      client.emit("messageReactionRemove", reaction, client.users.cache.get(packet.d.user_id));
    }
  });
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (!reaction || !user) return;
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the message:", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }

  let pinChannel = getConfig(config, reaction.message.guild.id, "pinChannel").replaceAll("<#", "").replaceAll(">", "");

  if (reaction.message.channel === pinChannel) return;
  if (user.username === "prae" || user.username === "jahoo" || user.username === "rgrwco" || user.username === "Dezine") {
    if (reaction.emoji.name === "📌") {
      if (reaction.message.reactions.cache.get("📌").count > 1) return;
      client.channels.cache.get(pinChannel).send(embedFormatter.pinFormat(reaction.message));
    }
  }
});

client.login(token);
client.commands = new Collection();

const config = {};
config.songQueue = [];
config.guilds = client.guilds.cache;

const cmdDirs = ["base", "debug", "music", "personal", "custom", "crypto", "suggest", "translate"];

cmdDirs.forEach((dir) => {
  for (const file of fs.readdirSync(`./commands/${dir}`)) {
    if (path.extname(file) === ".js") {
      const command = require(`./commands/${dir}/${file}`);
      if (command.enabled) {
        client.commands.set(command.name, command);
      }
    }
  }
});

let commandDB = null;

if (!fs.existsSync("./data/")) {
  fs.mkdirSync("./data/");
}
if (!fs.existsSync("./data/custom_commands.json")) {
  fs.writeFileSync("./data/custom_commands.json", "");
}
const customCommandAdapter = new FileSync("./data/custom_commands.json");
commandDB = low(customCommandAdapter);
commandDB.defaults({ customCommands: [] }).write();
config.commandDB = commandDB;

commandDB
  .get("customCommands")
  .value()
  .forEach((customCommand) => {
    if (!client.commands.has(customCommand.command)) {
      client.commands.set(customCommand.command, {
        name: customCommand.command,
        execute(config, message, args) {
          message.channel.send(customCommand.result);
        },
      });
    }
  });

config.guildConfig = {};

client.on("ready", () => {
  client.user.setUsername("Michael Rosen");
  client.user.setActivity("with hot food");
  client.guilds.cache.forEach((guild) => {
    if (!fs.existsSync(`./data/${guild.id}`)) {
      fs.mkdirSync(`./data/${guild.id}`);
      fs.writeFileSync(`./data/${guild.id}/config.json`, "{}");
    }
    const configDataAdapter = new FileSync(`./data/${guild.id}/config.json`);
    const configDB = low(configDataAdapter);
    configDB.defaults({ id: guild.id }).write();
    config.guildConfig[guild.id] = configDB;

    if (!fs.existsSync(`./data/${guild.id}/data`)) {
      fs.mkdirSync(`./data/${guild.id}/data`, { recursive: true });
    }
  });
});

client.on("message", (message) => {
  if (message.author.bot) return;
  commandDB
    .get("customCommands")
    .value()
    .forEach((cmd) => {
      if (message.content && cmd.command.toUpperCase() === message.content.toUpperCase()) {
        message.channel.send(cmd.result);
      }
    });
  const rnd1to100 = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  if (message.author.id === configuration.JOSH) {
    if (rnd1to100 <= 2) {
      message.react("🖕");
    }
  }
  if (message.author.id === configuration.LUKE) {
    if (rnd1to100 <= 1) {
      message.react("👑");
      message.react("⛽");
      message.react("💡");
    }
  }
  config.commands = client.commands;
  if (!message.content.match(configuration.PREFIXMATCH) || message.author.bot) return;
  signale.info(message.content);
  const args = message.content.split(/ +/);
  args.shift();
  if (args.length === 0) return;
  const command = args.shift().toLowerCase();
  signale.info(command);

  if (!client.commands.has(command)) {
    let response = "That's the wrong command!";
    if (message.author.id === configuration.JOSH) {
      response = "That's the wrong command, Josh!";
      message.react("🖕");
    }
    message.reply(response);
    return;
  }

  try {
    signale.success("Command: %s. Args: %s", command, args);
    if (client.commands.get(command).elevated) {
      if (configuration.ELEVATED.includes(message.author.id)) {
        client.commands.get(command).execute(config, message, args);
      } else {
        message.react("🖕");
        message.reply("Restricted command. Fuck off.");
      }
    } else {
      client.commands.get(command).execute(config, message, args);
    }
  } catch (error) {
    signale.fatal(error);
    message.react("😠");
    message.reply("there was an error executing that command");
  }
});

// client.destroy();
