module.exports = {
  name: "leave",
  description: "Forces Rosenbot to leave channel",
  usage: "leave",
  enabled: true,
  execute(config, message, args) {
    if (message.channel.type !== "text") return;
    const { channel } = message.member.voice;
    if (!channel) {
      return message.reply("Not in a channel");
    } else {
      channel.leave();
      if (config.serverQueue) {
        config.serverQueue.playing = false;
      }
    }
    message.channel.send("Go fuck yourself");
  },
};
