
module.exports = {
	name: 'leave',
	description: 'Forces Rosenbot to leave channel',
	enabled: true,
	execute(config, message, args) {
		if (message.channel.type !== 'text') return;
		const { channel } = message.member.voice;
		if (!channel) {
			return message.reply('Not in a channel');
        } else {
            channel.leave();
        }
		message.channel.send('Go fuck yourself');
	},
};
