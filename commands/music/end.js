module.exports = {
	name: 'end',
	description: 'End current queue',
	enabled: true,
	async execute(config, message, args) {
		const { channel } = message.member.voice;
		if (!channel) {
			return message.reply('Not in a channel');
		} else {
			channel.leave();
			if (config.serverQueue) {
				config.serverQueue.songs = [];
				config.serverQueue.playing = false;
			}
		}
	},
};
