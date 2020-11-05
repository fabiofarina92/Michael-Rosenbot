const request = require('request');
const httpRequestsHelper = require('../helpers/http-requests-helper');

module.exports = {
	name: 'catto',
	description: 'Fetch a picture of a random cat',
	enabled: true,
	execute(config, message, args) {

		httpRequestsHelper.sendStandardRequest('https://aws.random.cat/meow', function (response) {
			message.channel.send(response.file);
		});
	},
};
