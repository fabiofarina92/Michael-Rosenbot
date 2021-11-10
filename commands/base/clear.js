module.exports = {
  name: "clear",
  description: "Clear messages with number. Default 1 message",
  usage: "clear <number>",
  enabled: true,
  execute(config, message, args) {
    let messageDeleteCount = 1;
    if (!isNaN(args[0])) {
      messageDeleteCount = Number(args[0]);
    } else {
      message.channel.send("Number specified ain't no number.");
    }
    if (messageDeleteCount > 40) {
      message.channel.send("That's too many messages. I ain't doin' that. Cappin' at 10");
      messageDeleteCount = 40;
    }
    if (messageDeleteCount < 1) {
      message.channel.send("At least try and delete one message");
      messageDeleteCount = 1;
    }
    message.channel.bulkDelete(messageDeleteCount);
  },
};
