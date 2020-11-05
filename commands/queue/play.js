const ytdl = require("ytdl-core");
const youtubeHelper = require("../../helpers/youtube-helper");
const signale = require("signale");

module.exports = {
  name: "play",
  description: "Play song by name",
  usage: "--play <song-name>",
  enabled: false,
  execute(config, message, args) {
    this.configs = config;
    const fullString = args.join(" ");

    const { channel } = message.member.voice;
    if (fullString.indexOf("www.youtube") > 0) {
      handleVideo(
        config,
        { id: 1, title: "unknown", link: fullString },
        message,
        channel
      );
    } else {
      youtubeHelper.searchFullYoutube(fullString, message, function (response) {
        if (!channel) {
          return message.reply("please join a voice channel first");
        }
        handleVideo(config, response, message, channel);
      });
    }
		message.delete({ timeout: 5000, reason: 'Because I said so' });
  },
};

async function handleVideo(
  config,
  video,
  message,
  channel,
  playlist = false
) {
  const serverQueue = config.queue.get(message.guild.id);
  const song = {
    id: video.id,
    title: video.title,
    url: video.link,
  };

  if (!serverQueue) {
    const queueConstruct = {
      textChannel: message.channel,
      channel: channel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };
    config.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    try {
      // queueConstruct.connection = await voiceChannel.join();
      channel.join().then((connection) => {
        play(config, message, queueConstruct.songs[0], connection)
          .on("start", () => {
            signale.success("Playing music stream");
            message.channel.send("Playback started.");
          })
          .on("finish", (reason) => {
            if (reason === "Stream is not generating quickly enough.") {
              message.channel.send("Playback ended.");
              console.log("Song ended.");
            } else {
              console.log(reason);
            }
            queueConstruct.songs.shift();
            play(config, message, queueConstruct.songs[0], connection);
          })
          .on("error", (error) => {
            console.error(error);
          });
      });
    } catch (error) {
      console.error(`I couldn't join the voice channel: ${error}`);
      config.queue.delete(message.guild.id);
      return message.channel.send(
        `I couldn't join the voice channel: ${error}`
      );
    }
  } else {
    config.serverQueue.songs.push(song);
    message.channel.send(`** ${song.title} has been added to the queue **`);
  }
  return undefined;
}

function play(config, message, song, connection) {
  const serverQueue = config.queue.get(message.guild.id);

  if (!song) {
    serverQueue.channel.leave();
    config.queue.delete(message.guild.id);
    return;
  }

  serverQueue.textChannel.send(`Now playing: ${serverQueue.songs[0].url}`);
  const stream = ytdl(song.url, { filter: "audioonly" });
  const dispatcher = connection.play(stream);
  dispatcher.setVolumeLogarithmic(5 / 5);
  return dispatcher;
}
