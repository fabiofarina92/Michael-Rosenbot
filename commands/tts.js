const ytdl = require('ytdl-core');

module.exports = {
	name: 'tts',
	description: 'Play a text to speech command',
	usage: 'tts <message>',
	enabled: false,
	execute(config, message, args) {

		if (message.channel.type !== 'text') return;
		const { channel } = message.member.voice;
		if (!channel) {
			return message.reply('please join a voice channel first');
		}
		channel.join().then(connection => {
			if (args[0] === undefined) {
				message.channel.send('This is a message', { tts: true });
			} else {
				message.channel.send(args.join(' '), { tts: true });
			}
			channel.leave();
		});
	},
};
