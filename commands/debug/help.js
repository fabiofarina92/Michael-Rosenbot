module.exports = {
	name: 'help',
	description: 'Lists all the commands',
	enabled: true,
	execute(config, message, args) {
        var commandString = '';
        config.commands.forEach(command => {            
            if(command.enabled) {
                commandString = commandString.concat(`**Command:** ${command.name}\n`);
                commandString =  commandString.concat(`**Description:** ${command.description}\n`);
                if(command.usage) {
                    commandString = commandString.concat(`**Usage:** ${command.usage}\n`);
                }
                commandString = commandString.concat('\n');
            }  
        });

        message.channel.send(commandString);            
        
		message.delete(1000);
	},
};