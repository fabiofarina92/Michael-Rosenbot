const fs = require("fs");
function generateOutputFile(channel, member) {
  const fileName = `./recordings/${channel.id}-${member.id}-${Date.now()}.pcm`;
  return fs.createWriteStream(fileName);
}
module.exports = {
  name: "record",
  description: "Initiate a recording",
  enabled: true,
  execute(config, message, args) {
    let target = "";
    if (args.length > 0) {
      target = args[0];
    }

    if (message.channel.type !== "text") return;
    const { channel } = message.member.voice;
    if (!channel) {
      return message.reply("please join a voice channel first");
    }

    channel
      .join()
      .then((connection) => {
        message.reply("ready!");

        connection.on("speaking", (user, speaking) => {
          console.log(user.tag, speaking.toArray());
          if (speaking) {
            message.channel.send(`I'm listening to ${user}`);
            const audioStream = connection.receiver.createStream(user, {
              mode: "pcm",
            });
            const outputStream = generateOutputFile(channel, user);

            audioStream.pipe(outputStream);
            outputStream.on("data", console.log);
            audioStream.on("end", () => {
              message.channel.send(`I'm no longer listening to ${user}`);
            });
          }
        });
      })
      .catch(console.log);
  },
};
