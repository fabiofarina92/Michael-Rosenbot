const httpRequestsHelper = require('../helpers/http-requests-helper');

module.exports = {
	name: 'doggo',
	description: 'Fetch a picture of a random doggo',
	enabled: true,
	execute(config, message, args) {

		httpRequestsHelper.sendBasicGet('https://dog.ceo/api/breeds/image/random')
			.then((response) => {
				message.channel.send(response.data.message);
			});
	},
};
