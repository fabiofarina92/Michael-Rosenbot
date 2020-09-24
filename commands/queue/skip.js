module.exports = {
	name: 'skip',
	description: 'Skip to next song in the queue',
	enabled: true,
	execute(config, message, args) {

		this.configs = config;

		const { channel } = message.member.voice;
		if (!channel) {
			return message.reply('please join a voice channel first');
		}
		if (!config.serverQueue) {
			return message.channel.send('There is nothing playing that I could skip.');
		}
		config.serverQueue.connection.dispatcher.end('Skip command has been used');

		message.delete(1000);
	},
};