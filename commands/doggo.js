const request = require('request');
const httpRequestsHelper = require('../helpers/http-requests-helper');

module.exports = {
	name: 'doggo',
	description: 'Random doggos',
	execute(client, message, args) {

		httpRequestsHelper.sendStandardRequest('https://dog.ceo/api/breeds/image/random', function(response) {
			message.channel.send(response.message);
		});
		message.delete(1000);
	},
};