const { MessageEmbed } = require("discord.js");
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
};
