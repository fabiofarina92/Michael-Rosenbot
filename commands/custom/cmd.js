const signale = require("signale");

module.exports = {
	name: 'cmd',
	description: 'Create and delete custom commands',
	enabled: true,
	execute(config, message, args) {
        let { action, command, result } = parseArguments(args);

        signale.info('action', action);
        signale.info('command', command);
        signale.info('result', result);

        signale.info('commandDB', config.commandDB.getState());

        if (verifyAction(action)) {
            let commandExists = hasCommand(config.commands, config.commandDB.getState(), command);
            switch (action) {
                case 'add':
                    if (commandExists) {
                        signale.info('Command `%s` already exists', command);
                        message.channel.send(`Command \`${command}\` already exists!`)
                    } else {
                        signale.info('Creating command: `%s`', command);
                        config.commandDB.get('customCommands').push({ command, result }).write();
                        config.commands.set(command, {
                            name: command,
                            execute(config, message, args) {
                                message.channel.send(result);
                            }
                        })
	                    message.channel.send(`Command \`${command}\` has been created.`)
                    }
                    break;
                case 'rm':
                    if (!commandExists) {
                        signale.info('Command %s does not exist', command);
                        message.channel.send(`Command \`${command}\` does not exists!`)
                    } else {
                        config.commandDB.get('customCommands').remove({ command }).write();
                        config.commands.delete(command);
                        message.channel.send(`Command \`${command}\` has been removed.`)

                    }
                    break;
                default:
                    break;
            }

        }
	},
};

function parseArguments(args) {
    action = args[0];
    command = args[1];
    result = args.slice(2).join(" ");

    return { action, command, result };
}

function verifyAction(action) {
    actions = [ 'add', 'rm', 'ls' ]
    return actions.includes(action);
}

function hasCommand(configCommands, customCommands, command) {
    let exists = false;
    if (configCommands.has(command)) {
        exists = true;
    }
    if(Object.keys(customCommands).includes(command)) {
        exists = true;
    }
    return exists;
}
