const signale = require("../../helpers/logger");
const embedFormatter = require("../../utils/embed-formatter");
module.exports = {
  name: "quote",
  description: "Fetch message and quote it",
  usage: "quote <url>",
  enabled: true,
  execute(config, message, args) {
    let messageId = args[0].split("/").at(-1);
    let channelId = args[0].split("/").at(-2);
    let guildId = args[0].split("/").at(-3);

    let quoteMessage = config.guilds.get(guildId).channels.cache.get(channelId).messages.fetch(messageId);
    quoteMessage.then((quote) => {
      if (quote.embeds.length > 0) {
        let embed = quote.embeds[0];
        message.channel.send(embed);
      } else {
        message.channel.send(embedFormatter.quoteFormat(quote));
      }
    });
  },
};
