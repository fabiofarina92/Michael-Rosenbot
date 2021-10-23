const { MessageEmbed } = require("discord.js");
const signale = require('../helpers/logger')
module.exports = {
  songFormat(song) {
    const embed = new MessageEmbed();
    embed.setColor("#00ff99");
    embed.setTitle(song.title);
    embed.setURL(song.url);
    embed.setAuthor(song.channel.name, song.channel.icon);
    embed.setDescription(`Requested by ${song.requestor.name}`);
    embed.setThumbnail(song.requestor.avatar);
    embed.setImage(song.thumbnail.url);

    return embed;
  },

  pinFormat(message) {
    const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Pinned Message")
        .setURL(message.url)
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTimestamp()
        .setDescription(message.content);

    if (message.content === "") {
      embed.setDescription("image");
    }
    if (message.attachments.first()) {
      embed.setImage(message.attachments.first().attachment);
    }
    return embed;
  },

  quoteFormat(message) {
    const embed = new MessageEmbed()
        .setColor("#9900FF")
        .setTitle("Quote")
        .setURL(message.url)
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(message.content);

    if (message.content === "") {
      embed.setDescription("image");
    }
    if (message.attachments.first()) {
      embed.setImage(message.attachments.first().attachment);
    }

    return embed;
  }

};
