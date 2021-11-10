const ytdl = require("ytdl-core");
const { praeId } = require("../../secrets.json");

module.exports = {
  name: "debug",
  description: "debug information",
  enabled: true,
  execute(config, message, args) {
    // const video = 'https://www.youtube.com/watch?v=CYqq9Ovz_9c';
    message.delete(1000);
    // console.log(message);
    if (message.author.id === praeId) {
      message.channel.send("Hello Prae");
    } else {
      message.channel.send("Hello");
    }
    const user = message.guild.member(message.mentions.users.first());
    const user2 = message.mentions.users.first();
    console.log("user", user2.displayAvatarURL);
    // console.log(message.member.guild.channels);
    // message.member.guild.channels.forEach(element => {
    // 	if(element['type'] === 'voice') {
    // 		console.log('Hit voice');
    // 		element.join().then(connection => {
    // 			const stream = ytdl(video, { filter: 'audioonly' });
    // 			const dispatcher = connection.playStream(stream);
    // 			dispatcher.on('end', () => {
    // 				element.leave();
    // 			});
    // 		});
    // 	}
    // 	// console.log(element['type']);
    // });
    // // const { voiceChannel } = message.member;
    // if(!voiceChannel) {
    // 	return message.reply('please join a voice channel first');
    // }
    // voiceChannel.join().then(connection => {
    // 	const stream = ytdl(video, { filter: 'audioonly' });
    // 	const dispatcher = connection.playStream(stream);

    // 	dispatcher.on('end', () => {
    // 		voiceChannel.leave();
    // 	});
    // });
  },
};
