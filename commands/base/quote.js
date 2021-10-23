const signale = require('../../helpers/logger');
const embedFormatter = require('../../utils/embed-formatter');
module.exports = {
	name: "quote",
	description: "Fetch message and quote it",
	usage: "quote <url>",
	enabled: true,
	execute(config, message, args) {
		let id = args[0].split("/").at(-1);
		signale.info(id);
		let quoteMessage = message.channel.messages.fetch(id);
		quoteMessage.then((quote) => {
			if (quote.embeds.length > 0) {
				let embed = quote.embeds[0];
				message.channel.send(embed);
			} else {
				message.channel.send(embedFormatter.quoteFormat(quote));
			}
		})
	},
};
