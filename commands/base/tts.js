const ytdl = require("ytdl-core");
const signale = require("../../helpers/logger");

module.exports = {
  name: "tts",
  description: "Play a text to speech command",
  usage: "tts <message>",
  enabled: true,
  execute(config, message, args) {
    let chonkedArray = [];
    let done = false;
    while (!done) {
      chonkedArray.push(args.splice(0, 20).join(" "));
      if (args.length === 0) {
        done = true;
      }
    }

    if (chonkedArray.length > 7) {
      message.reply("That message is waaaaay too long");
      return;
    }
    chonkedArray.forEach((chonk) => {
      message.channel.send(chonk, { tts: true });
    });

    // if (message.channel.type !== "text") return;
    // const { channel } = message.member.voice;
    // if (!channel) {
    //   return message.reply("please join a voice channel first");
    // }
    // channel.join().then((connection) => {
    //   if (args[0] === undefined) {
    //     message.channel.send("This is a message", { tts: true });
    //   } else {
    //     message.channel.send(args.join(" "), { tts: true });
    //   }
    //   channel.leave();
    // });
  },
};
