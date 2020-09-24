module.exports = {
	name: 'ping',
	description: 'Ping command to see if bot is working.',
	enabled: true,
	execute(config, message, args) {
		message.channel.send('Pong! <@!137721021649125376>' + args);

		message.delete({ timeout: 1000, reason: "Don't like messages" } );
	},
};
