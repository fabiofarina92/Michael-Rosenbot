module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(client, message, args) {
		message.channel.send('Pong!' + args);
		
		message.delete(1000);
	},
};