const ytdl = require('ytdl-core');

module.exports = {
	name: 'initd',
	description: 'Initial D',
	execute(client, message, args) {
		let video = 'https://www.youtube.com/watch?v=dv13gl0a-FA';
		if(args[0] === 'dejavu') {
			video = 'https://www.youtube.com/watch?v=dv13gl0a-FA';
		}
		else if(args[0] === 'gas') {
			video = 'https://www.youtube.com/watch?v=5r1LBJK0zxo';
		}
		else if(args[0] === 'running') {
			video = 'https://www.youtube.com/watch?v=XCiDuy4mrWU';
		}
		else if(args[0] === 'other') {
			video = 'https://www.youtube.com/watch?v=sFODclG8mBY';
		}
		if(message.channel.type !== 'text') return;
		const { voiceChannel } = message.member;
		if(!voiceChannel) {
			return message.reply('please join a voice channel first');
		}
		voiceChannel.join().then(connection => {
			const stream = ytdl(video, { filter: 'audioonly' });
			const dispatcher = connection.playStream(stream);

			dispatcher.on('end', () => {
				voiceChannel.leave();
			});
		});
		message.delete(1000);
	},
};