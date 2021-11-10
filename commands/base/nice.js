const ytdl = require("ytdl-core");

module.exports = {
  name: "nice",
  description: "Get a special message from Michael",
  usage: "nice, nice full, nice dank, nice multi, nice other",
  enabled: true,
  execute(config, message, args) {
    let video = "https://www.youtube.com/watch?v=CYqq9Ovz_9c";
    if (args[0] === "full") {
      video = "https://www.youtube.com/watch?v=Akwm2UZJ34o";
    } else if (args[0] === "dank") {
      video = "https://www.youtube.com/watch?v=1wDHbOdqjTE";
    } else if (args[0] === "multi") {
      video = "https://www.youtube.com/watch?v=3lCu3sK1Pis";
    } else if (args[0] === "other") {
      video = "https://www.youtube.com/watch?v=gwAKwqlYyOA&t";
    }
    if (message.channel.type !== "text") return;
    const { channel } = message.member.voice;
    if (!channel) {
      return message.reply("please join a voice channel first");
    }
    channel.join().then((connection) => {
      const stream = ytdl(video, { filter: "audioonly" });
      const dispatcher = connection.play(stream);

      dispatcher.on("finish", () => {
        channel.leave();
      });
    });
  },
};
