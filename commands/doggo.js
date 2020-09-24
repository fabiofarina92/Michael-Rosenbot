const request = require('request');
const httpRequestsHelper = require('../helpers/http-requests-helper');

module.exports = {
	name: 'doggo',
	description: 'Fetch a picture of a random doggo',
	enabled: true,
	execute(config, message, args) {

		httpRequestsHelper.sendStandardRequest('https://dog.ceo/api/breeds/image/random', function (response) {
			message.channel.send(response.message);
		});
		message.delete({ timeout: 5000, reason: 'Because I said so' });
	},
};
