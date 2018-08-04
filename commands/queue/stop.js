module.exports = {
	name: 'stop',
	description: 'Stop all and clear queue',
	execute(config, message, args) {
        
        this.configs = config;        
        
        const { voiceChannel } = message.member;
        if(!voiceChannel) {
            return message.reply('please join a voice channel first');
        }
        if(!config.serverQueue) {
            return message.channel.send('There is nothing playing that I could stop.');
        }
        config.serverQueue.songs = [];
        config.serverQueue.connection.dispatcher.end('Stopping all.');
        
		message.delete(1000);
	},
};