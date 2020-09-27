module.exports = {
	name: 'pause',
	description: 'Pause playback. Type --resume to resume',
	enabled: false,
	execute(config, message, args) {

		this.configs = config;

		const { channel } = message.member.voice;
		if (!channel) {
			return message.reply('please join a voice channel first');
		}
		if (!config.serverQueue) {
			return message.channel.send('There is nothing playing.');
		}
		if (config.serverQueue.playing) {
			config.serverQueue.playing = false;
			config.serverQueue.connection.dispatcher.pause();
			return message.channel.send('Pausing playback');
		}

		message.delete({ timeout: 5000, reason: 'Because I said so' });
		message.delete(1000);

	},
};