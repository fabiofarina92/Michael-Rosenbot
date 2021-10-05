module.exports = {
	name: 'pause',
	description: 'Pause the current song',
	enabled: true,
	async execute(config, message, args) {
		if (config.serverQueue.playing) {
			config.serverQueue.playing = false;
			config.serverQueue.connection.dispatcher.pause();
			return message.reply('Pausing playback');
		}
	},
};
