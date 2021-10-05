const ytdl = require('ytdl-core');

module.exports = {
	name: 'initd',
	description: 'Play Initial D songs',
	usage: 'initd dejavu, initd gas, initd running',
	enabled: true,
	execute(config, message, args) {
		let video = 'https://www.youtube.com/watch?v=dv13gl0a-FA';
		if (args[0] === 'dejavu') {
			video = 'https://www.youtube.com/watch?v=dv13gl0a-FA';
		} else if (args[0] === 'gas') {
			video = 'https://www.youtube.com/watch?v=5r1LBJK0zxo';
		} else if (args[0] === 'running') {
			video = 'https://www.youtube.com/watch?v=XCiDuy4mrWU';
		} else if (args[0] === 'other') {
			video = 'https://www.youtube.com/watch?v=sFODclG8mBY';
		}
		if (message.channel.type !== 'text') return;
		const { channel } = message.member.voice;
		if (!channel) {
			return message.reply('please join a voice channel first');
		}
		channel.join().then(connection => {
			const stream = ytdl(video, {
				filter: 'audioonly', quality: 'highestaudio',
				highWaterMark: 1 << 25
			});
			const dispatcher = connection.play(stream);

			dispatcher.on('end', () => {
				channel.leave();
			});
		});
	},
};
