const request = require('snekfetch');

module.exports = {
	name: 'logs',
	description: 'Show logs',
	execute(client, message, args) {
		const { body } = request.get('https://aws.random.cat/meow');
		
		message.channel.send(body.file);
	},
};