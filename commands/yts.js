const ytdl = require('ytdl-core');
const youtubeHelper = require('../helpers/youtube-helper');
const { youtubetoken } = require('../secrets.json');

module.exports = {
	name: 'yts',
	description: 'Youtube Search',
	execute(config, message, args) {
        
        const fullString = args.join(' ');
        
        youtubeHelper.searchYoutube(fullString, message, function(response) {     
            const { voiceChannel } = message.member;
            if(!voiceChannel) {
                return message.reply('please join a voice channel first');
            }
            voiceChannel.join().then(connection => {
                console.log('Playing: ' + response);
                const stream = ytdl(response, { filter: 'audioonly' });
                const dispatcher = connection.playStream(stream);
    
                dispatcher.on('end', () => {
                    voiceChannel.leave();
                });
            });
            console.dir(response);			
        });
		
		message.delete(1000);
	},
};