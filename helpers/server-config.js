const signale = require("./logger");
module.exports = {
  getConfig(config, server, key) {
    if (!checkValidConfigKey(config, server, key)) {
      signale.info(`Key: ${key} not present in server`);
    } else {
      return config.guildConfig[server].get(key).value();
    }
  },
  setConfig(config, server, key, value) {
    config.guildConfig[server].assign({ [key]: value }).write();
    return config.guildConfig[server].get(key).value() === value;
  },
  getAllConfigs(config, server) {
    if (!checkValidServer(config, server)) {
      signale.info(`Server ${server} invalid`);
    } else {
      let configArray = [];
      Object.keys(config.guildConfig[server].value()).forEach((key) => configArray.push({ key: key, value: config.guildConfig[server].get(key).value() }));
      return configArray;
    }
  },
};

function checkValidServer(config, server) {
  if (!config.guildConfig[server]) return false;
  return true;
}

function checkValidConfigKey(config, server, key) {
  if (!checkValidServer(config, server)) return false;
  if (config.guildConfig[server].get(key).value() === null) return false;
  return true;
}
