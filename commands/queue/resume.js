module.exports = {
	name: 'resume',
	description: 'Resume playback',
	enabled: true,
	execute(config, message, args) {

		this.configs = config;

		const { voiceChannel } = message.member;
		if (!voiceChannel) {
			return message.reply('please join a voice channel first');
		}
		if (!config.serverQueue) {
			return message.channel.send('There is nothing playing.');
		}
		if (!config.serverQueue.playing) {
			config.serverQueue.playing = true;
			config.serverQueue.connection.dispatcher.resume();
			return message.channel.send('Resuming playback');
		}

		message.delete(1000);
	},
};