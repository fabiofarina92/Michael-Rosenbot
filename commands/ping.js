module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(config, message, args) {
		message.channel.send('Pong!' + args);
		
		message.delete(1000);
	},
};