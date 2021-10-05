const inquirer = require("inquirer");
const Discord = require("discord.js");
const { token } = require("./secrets.json");
const client = new Discord.Client();
client.login(token);

client.on("ready", () => {
  let guilds = {};
  client.guilds.cache.forEach((guild) => {
    guilds[guild.id] = { name: guild.name, channels: guild.channels };
  });

  let selectedGuild = null;
  inquirer
    .prompt([
      {
        type: "list",
        name: "guild",
        message: "Which server would you like to message?",
        choices: Object.keys(guilds).map((g) => guilds[g].name),
      },
    ])
    .then((guildAnswer) => {
      selectedGuild = Object.keys(guilds).filter(
        (g) => guilds[g].name === guildAnswer.guild
      );
      let channels = {};
      guilds[selectedGuild].channels.cache.forEach((channel) => {
        channels[channel.id] = { name: channel.name, type: channel.type };
      });
      let selectedChannel = null;
      inquirer
        .prompt([
          {
            type: "list",
            name: "channel",
            message: "Which channel would you prefer?",
            choices: Object.keys(channels)
              .map((c) => {
                if (channels[c].type === "text") return channels[c].name;
              })
              .filter((c) => c),
          },
        ])
        .then((channelAnswer) => {
          selectedChannel = Object.keys(channels).filter(
            (c) => channels[c].name === channelAnswer.channel
          );
          const promptData = [
            {
              type: "input",
              name: "message",
              message: "Send > ",
            },
          ];
            const channel = client.channels.cache.get(selectedChannel[0]);
            prompt(promptData, channel);
        });
    });
});

function prompt(promptData, channel) {
  inquirer.prompt(promptData).then((answer) => {
    if (answer.message !== "stop") {
      channel.send(answer.message);
      prompt(promptData, channel);
    }
  });
}
