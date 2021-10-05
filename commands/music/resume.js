module.exports = {
	name: 'resume',
	description: 'Resume the current song',
	enabled: true,
	async execute(config, message, args) {
		if (!config.serverQueue.playing) {
			config.serverQueue.playing = true;
			config.serverQueue.connection.dispatcher.resume();
			return message.reply('Resume playback');
		}
	},
};
