const { MessageAttachment, MessageEmbed } = require("discord.js");
const signale = require("../helpers/logger");
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
    const embed = new MessageEmbed().setColor("#9900FF").setTitle("Quote").setURL(message.url).setAuthor(message.author.username, message.author.avatarURL()).setDescription(message.content);

    if (message.content === "") {
      embed.setDescription("image");
    }
    if (message.attachments.first()) {
      embed.setImage(message.attachments.first().attachment);
    }

    return embed;
  },

  movieFormat(movie) {
    return new MessageEmbed()
      .setColor("#0d253f")
      .setTitle(movie.original_title)
      .addFields({ name: "Release Date", value: movie.release_date, inline: true }, { name: "Popularity", value: `${movie.vote_average} / 10`, inline: true })
      .setThumbnail(`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`)
      .setDescription(movie.overview);
  },

  binFormat(suburb) {
    const attachment = new MessageAttachment("./assets/bin.jpg", "bin.jpg");
    return new MessageEmbed()
      .setColor("#0fff1b")
      .setTitle(suburb.suburb)
      .addFields(
        { name: "Garbage Bin", value: suburb.garbage_pickup_date, inline: true },
        { name: "Recycling Bin", value: suburb.recycling_pickup_date, inline: true },
        { name: "Greenwaste Bin", value: suburb.next_greenwaste_date, inline: true }
      )
      .attachFiles(attachment)
      .setThumbnail("attachment://bin.jpg");
  },
};
