module.exports = {
	name: 'pause',
	description: 'Pause playback. Type --resume to resume',
	enabled: true,
	execute(config, message, args) {
        
        this.configs = config;        
        
        const { voiceChannel } = message.member;
        if(!voiceChannel) {
            return message.reply('please join a voice channel first');
        }
        if(!config.serverQueue) {
            return message.channel.send('There is nothing playing.');
        }
        if(config.serverQueue.playing) {
            config.serverQueue.playing = false;
            config.serverQueue.connection.dispatcher.pause();
            return message.channel.send('Pausing playback');            
        }
        
		message.delete(1000);
	},
};