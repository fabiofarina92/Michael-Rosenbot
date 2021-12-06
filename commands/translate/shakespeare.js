const httpRequestsHelper = require("../../helpers/http-requests-helper");
const embedFormatter = require("../../utils/embed-formatter");
const { shuffle } = require("../../utils/utils");

module.exports = {
  name: "shakespeare",
  description: "Translate a message into shakespearean",
  usage: "shakespeare text or shakespeare link",
  enabled: true,
  execute(config, message, args) {
    let text = "";
    if (args[0].toUpperCase() === "RECENT") {
      message.channel.messages.fetch({ limit: 2 }).then((messages) => {
        text = messages.array()[1].content;
        httpRequestsHelper.sendBasicGet(`https://api.funtranslations.com/translate/shakespeare.json?text=${text}`).then((response) => {
          message.channel.send(response.data.contents.translated);
        });
      });
      return;
    }
    if (args[0].indexOf("discord.com") > 0) {
      let messageId = args[0].split("/").at(-1);
      let channelId = args[0].split("/").at(-2);
      let guildId = args[0].split("/").at(-3);

      let quoteMessage = config.guilds.get(guildId).channels.cache.get(channelId).messages.fetch(messageId);
      quoteMessage.then((quote) => {
        text = quote;
        httpRequestsHelper.sendBasicGet(`https://api.funtranslations.com/translate/shakespeare.json?text=${text}`).then((response) => {
          message.channel.send(response.data.contents.translated);
        });
      });
    } else {
      text = args.join(" ");
      httpRequestsHelper.sendBasicGet(`https://api.funtranslations.com/translate/shakespeare.json?text=${text}`).then((response) => {
        message.channel.send(response.data.contents.translated);
      });
    }
  },
};
