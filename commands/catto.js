const httpRequestsHelper = require('../helpers/http-requests-helper');

module.exports = {
	name: 'catto',
	description: 'Fetch a picture of a random cat',
	enabled: true,
	execute(config, message, args) {

		httpRequestsHelper.sendBasicGet('https://aws.random.cat/meow')
			.then((response) => {
				message.channel.send(response.data.file);
			});
	},
};
