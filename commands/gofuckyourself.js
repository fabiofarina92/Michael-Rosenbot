module.exports = {
  name: "gofuckyourself",
  description: "Go fuck yourself",
  enabled: true,
  execute(config, message, args) {
    let target = "";
    if (args.length > 0) {
      target = args[0];
    }

    message.channel.send("Go fuck yourself " + target);
  },
};
