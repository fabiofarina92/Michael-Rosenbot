const { getConfig, getAllConfigs, setConfig } = require("../../helpers/server-config");
module.exports = {
  name: "config",
  description: "Get, set and list all custom configs",
  usage: "config ls | config get key | config set key value",
  enabled: true,
  elevated: true,
  execute(config, message, args) {
    if (args.length > 0) {
      switch (args[0]) {
        case "ls":
          runListCommand(config, message);
          break;
        case "get":
          if (args[1]) {
            let key = args[1];
            runGetCommand(config, message, key);
          }
          break;
        case "set":
          if (args[1] && args[2]) {
            let key = args[1];
            let value = args[2];
            runSetCommand(config, message, key, value);
          }
          break;
      }
    }
  },
};

const runListCommand = (config, message) => {
  let formattedString = "";
  getAll(config, message.guild.id).forEach((config) => (formattedString += `\r\n\`${config.key}\`: ${config.value}`));
  message.channel.send(formattedString);
};

const runGetCommand = (config, message, key) => {
  let serverConfigForKey = getServerConfig(config, message.guild.id, key);
  let formattedString = `\`${key}\`: ${serverConfigForKey}`;
  message.channel.send(formattedString);
};

const runSetCommand = (config, message, key, value) => {
  let result = setConfig(config, message.guild.id, key, value);
  if (!result) {
    message.reply("Something went wrong when setting the config");
  } else {
    message.channel.send(`Config \`${key}\` was successfully set to \`${value}\``);
  }
};

const getAll = (config, guildId) => {
  return getAllConfigs(config, guildId);
};

const getServerConfig = (config, guildId, key) => {
  return getConfig(config, guildId, key);
};
