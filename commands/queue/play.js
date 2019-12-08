const ytdl = require('ytdl-core');
const youtubeHelper = require('../../helpers/youtube-helper');

module.exports = {
	name: 'play',
	description: 'Play song by name',
	usage: '--play <song-name>',
	enabled: true,
	execute(config, message, args) {

		this.configs = config;
		const fullString = args.join(' ');

		const { voiceChannel } = message.member;
		if (fullString.indexOf('www.youtube') > 0) {
			handleVideo(config, { id: 1, title: 'unknown', link: fullString }, message, voiceChannel)
		} else {
			youtubeHelper.searchFullYoutube(fullString, message, function (response) {
				if (!voiceChannel) {
					return message.reply('please join a voice channel first');
				}
				handleVideo(config, response, message, voiceChannel);
			});
		}
		message.delete(1000);
	},
};

async function handleVideo(config, video, message, voiceChannel, playlist = false) {
	const serverQueue = config.queue.get(message.guild.id);
	const song = {
		id: video.id,
		title: video.title,
		url: video.link
	};

	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		config.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		try {
			queueConstruct.connection = await voiceChannel.join();
			play(config, message, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I couldn't join the voice channel: ${ error }`);
			config.queue.delete(message.guild.id);
			return message.channel.send(`I couldn't join the voice channel: ${ error }`);
		}
	} else {
		config.serverQueue.songs.push(song);
		message.channel.send(`** ${ song.title } has been added to the queue **`);
	}
	return undefined;
}

function play(config, message, song) {
	const serverQueue = config.queue.get(message.guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		config.queue.delete(message.guild.id);
		return;
	}

	serverQueue.textChannel.send(`Now playing: ${ serverQueue.songs[0].url }`);
	const stream = ytdl(song.url, { filter: 'audioonly' });
	const dispatcher = serverQueue.connection.playStream(stream)
			.on('end', reason => {
				if (reason === 'Stream is not generating quickly enough.') {
					message.channel.send('Playback ended.');
					console.log('Song ended.');
				} else {
					console.log(reason)
				}
				serverQueue.songs.shift();
				play(config, message, serverQueue.songs[0]);
			})
			.on('error', error => {
				console.error(error);
			});
	dispatcher.setVolumeLogarithmic(5 / 5);

}