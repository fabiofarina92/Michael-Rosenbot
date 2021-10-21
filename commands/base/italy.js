module.exports = {
  name: "🤌",
  description: "Whatsammatteryou???",
  usage: "🤌",
  enabled: true,
  execute(config, message, args) {
    message.react("🇮🇹");
    message.channel.send("BABATY BOOPY SPAGHETT" + args);
  },
};
