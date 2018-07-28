const ytdl = require('ytdl-core');
const search = require('youtube-search');
const { youtubetoken } = require('../secrets.json');

module.exports = {
	name: 'yts',
	description: 'Youtube Search',
	execute(client, message, args) {
        
        const fullString = args.join(' ');
        
        const opts = {
            maxResults: 1,
            key: youtubetoken,
        };

        search(fullString, opts, function(err, results) {
            if(err) return console.log(err);

            message.channel.send("This is what I found: " + results[0].link);
            const { voiceChannel } = message.member;
            if(!voiceChannel) {
                // Need to be in a channel before this works
                return message.reply('please join a voice channel first');
            }
            voiceChannel.join().then(connection => {
                const stream = ytdl(results[0].link, { filter: 'audioonly' });
                const dispatcher = connection.playStream(stream);
    
                dispatcher.on('end', () => {
                    voiceChannel.leave();
                });
            });
            console.dir(results[0].link);
        })
		
		message.delete(1000);
	},
};