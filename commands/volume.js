module.exports = {
	name: 'volume',
	description: 'Set volume of bot',
	execute(config, message, args) {
        
        this.configs = config;        
        
        const { voiceChannel } = message.member;
        if(!voiceChannel) {
            return message.reply('please join a voice channel first');
        }
        if(!config.serverQueue) {
            return message.channel.send('There is nothing playing.');
        }
        if(!args[0]) {
            return message.channel.send(`The current volume is: **${config.serverQueue.volume}**`);
        }
        config.serverQueue.volume = args[0];
        config.serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
        message.channel.send(`Volume has been set to **${args[0]}**`);
        
		message.delete(1000);
	},
};