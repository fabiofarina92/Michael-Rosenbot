const ytdl = require('ytdl-core');

module.exports = {
	name: 'poll',
	description: 'Multi option poll',
	execute(client, message, args) {

		const fullString = args.join(' ');

		const split = fullString.split('\"').filter(function(element, index, array) {
			return ((index + 1) % 2 === 0);
		});
		console.log(split);
		console.log(Math.floor((Math.random() * split.length)) + 1);
		if(message.channel.type !== 'text') return;
		const { voiceChannel } = message.member;
		if(!voiceChannel) {
			return message.reply('please join a voice channel first');
		}
		voiceChannel.join().then(connection => {

			message.channel.send('The response to the question: ' + split[0] + ' is ' + split[Math.floor((Math.random() * split.length)) + 1], { tts: true });

			// if(args[0] === undefined) {
			// 	message.channel.send('This is a message', { tts: true });
			// }
			// else {
			// 	message.channel.send(args.join(' '), { tts: true });
			// }
			voiceChannel.leave();
		});
		message.delete(1000);
	},
};