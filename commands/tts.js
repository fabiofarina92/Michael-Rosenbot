const ytdl = require('ytdl-core');

module.exports = {
	name: 'tts',
	description: 'Play a text to speech command',
	usage: '--tts <message>',
	enabled: true,
	execute(config, message, args) {

		if (message.channel.type !== 'text') return;
		const { voiceChannel } = message.member;
		if (!voiceChannel) {
			return message.reply('please join a voice channel first');
		}
		voiceChannel.join().then(connection => {
			if (args[0] === undefined) {
				message.channel.send('This is a message', { tts: true });
			} else {
				message.channel.send(args.join(' '), { tts: true });
			}
			voiceChannel.leave();
		});
		message.delete({ timeout: 5000, reason: 'Because I said so' });
	},
};
