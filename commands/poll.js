const ytdl = require('ytdl-core');

module.exports = {
	name: 'poll',
	description: 'WIP: Multi option poll with random otucome',
	usage: '--poll "question" "answer 1" "answer 2" "answer 3"',
	enabled: false,
	execute(config, message, args) {

		const fullString = args.join(' ');

		const split = fullString.split('\"').filter(function (element, index, array) {
			return ((index + 1) % 2 === 0);
		});
		console.log(split);
		console.log(Math.floor((Math.random() * split.length)) + 1);
		if (message.channel.type !== 'text') return;
		const { channel } = message.member.voice;
		if (!channel) {
			return message.reply('please join a voice channel first');
		}
		channel.join().then(connection => {

			message.channel.send('The response to the question: ' + split[0] + ' is ' + split[Math.floor((Math.random() * split.length)) + 1], { tts: true });

			channel.leave();
		});
	},
};
