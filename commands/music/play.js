const YouTube = require("youtube-sr").default;
const httpRequestsHelper = require("../../helpers/http-requests-helper");
const signale = require("../../helpers/logger");

module.exports = {
  name: "play",
  description: "Play audio from youtube",
  enabled: true,
  async execute(config, message, args) {
    if (message.channel.type !== "text") return;
    const { channel } = message.member.voice;
    if (!channel) {
      return message.reply("please join a voice channel first");
    }

    await searchYoutube(config, args.join(), message, channel);

    if (!config.serverQueue.playing) {
      config.serverQueue.connection =
        await config.serverQueue.voiceChannel.join();
      // message.reply(`Now playing ${ config.serverQueue.songs[0].title }`)
      httpRequestsHelper.play(
        config.serverQueue,
        config.serverQueue.songs[0],
        message
      );
    } else {
      message.channel.send(`Queued up ${config.serverQueue.songs[1].title}`);
    }
  },
};

const searchYoutube = async (config, query, message, channel) => {
  const videos = await YouTube.search(query, { limit: 1 }).catch(
    async function () {
      message.reply("Error processing your request");
    }
  );
  if (!videos) {
    message.reply("Couldn't find the video specified. Try again");
    return;
  }

  if (!config.serverQueue) {
    config.serverQueue = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: false,
    };
  }
  signale.info(videos[0]);
  config.serverQueue.songs.push({
    title: videos[0].title,
    url: `https://www.youtube.com/watch?v=${videos[0].id}`,
    requestor: {
      name: message.guild.member(message.author).displayName,
      avatar: message.author.avatarURL(),
    },
    channel: { name: videos[0].channel.name, icon: videos[0].channel.icon.url },
    thumbnail: videos[0].thumbnail,
  });

  signale.info(config.serverQueue.songs);
};

// function play(serverQueue, song) {
// 	if (!song) {
// 		serverQueue.playing = false;
// 		serverQueue.voiceChannel.leave();
// 	}
// 	const stream = ytdl(song.url, { filter: 'audioonly' });
// 	serverQueue.playing = true;
// 	serverQueue.connection.play(stream)
// 			.on('end', () => {
// 				serverQueue.songs.shift();
// 				play(serverQueue.songs[0])
// 			})
// 			.on('error', (error) => {
// 				signale.error(error)
// 			})
// }
