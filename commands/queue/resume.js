module.exports = {
	name: 'resume',
	description: 'Resume playback',
	enabled: true,
	execute(config, message, args) {

		this.configs = config;

		const { channel } = message.member.voice;
		if (!channel) {
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

		message.delete({ timeout: 5000, reason: 'Because I said so' });
		message.delete(1000);
	},
};