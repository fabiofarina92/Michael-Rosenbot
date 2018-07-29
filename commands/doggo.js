const request = require('request');

module.exports = {
	name: 'doggo',
	description: 'Random doggos',
	execute(client, message, args) {

		request('https://dog.ceo/api/breeds/image/random', function(error, response, body) {
			console.log('error:', error); // Print the error if one occurred
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

			const content = JSON.parse(body);
			console.log('body:', content); // Print the HTML for the Google homepage.
			console.log('string body', content.message);

			message.channel.send(content.message);
		});
		
		message.delete(1000);
	},
};