const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const configuration = require('./config.json');
const { token } = require('./secrets.json');
const signale = require('signale');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const client = new Discord.Client();
client.login(token);
client.commands = new Discord.Collection();

const baseCommandFiles = fs.readdirSync('./commands');
const debugCommandFiles = fs.readdirSync('./commands/debug');
const personalCommandFiles = fs.readdirSync('./commands/personal');
const customCommandsFile = fs.readdirSync('./commands/custom');

const config = {};

for (const file of baseCommandFiles) {
	if (path.extname(file) === '.js') {
		const command = require(`./commands/${ file }`);
		if (command.enabled) {
			client.commands.set(command.name, command);
		}
	}
}

for (const file of debugCommandFiles) {
	if (path.extname(file) === '.js') {
		const command = require(`./commands/debug/${ file }`);
		if (command.enabled) {
			client.commands.set(command.name, command);
		}
	}
}

for (const file of personalCommandFiles) {
	if (path.extname(file) === '.js') {
		const command = require(`./commands/personal/${ file }`);
		if (command.enabled) {
			client.commands.set(command.name, command);
		}
	}
}

for (const file of customCommandsFile) {
	if (path.extname(file) === '.js') {
		const command = require(`./commands/custom/${ file }`);
		if (command.enabled) {
			client.commands.set(command.name, command);
		}
	}
}

const customCommandAdapter = new FileSync('./data/custom_commands.json');
const commandDB = low(customCommandAdapter);
commandDB.defaults({ customCommands: [] }).write();
config.commandDB = commandDB;

signale.info(commandDB.get('customCommands').value());
commandDB.get('customCommands').value().forEach((customCommand) => {
	if (!client.commands.has(customCommand.command)) {
		client.commands.set(customCommand.command, {
			name: customCommand.command,
			execute(config, message, args) {
				message.channel.send(customCommand.result);
			}
		})
	}
})

client.on('message', (message) => {
	signale.info(message.author);
	const rnd1to100 = Math.floor(Math.random() * (100 - 1 + 1) + 1)
	if (message.author.id === configuration.JOSH) {
		if (rnd1to100  <= 5) {
			message.react('🖕');
		}
	}
	client.user.setUsername('Michael Rosen');
	client.user.setActivity('with hot food');
	config.commands = client.commands;
	if (!message.content.match(configuration.PREFIXMATCH) || message.author.bot) return;
	const args = message.content.split(/ +/);
	args.shift();
	const command = args.shift().toLowerCase();
	signale.info(command);

	if (!client.commands.has(command)) {
		let response = "That's the wrong command!"
		if (message.author.id === configuration.JOSH) {
			response = "That's the wrong command, Josh!";
			message.react('🖕');
		}
		message.reply(response);
		return;
	}

	try {
		signale.success('Command: %s. Args: %s', command, args);
		if (client.commands.get(command).elevated) {
			if (configuration.ELEVATED.includes(message.author.id)) {
				client.commands.get(command).execute(config, message, args);
			} else {
				message.react('🖕');
				message.reply('Restricted command. Fuck off.');
			}
		} else {
			client.commands.get(command).execute(config, message, args);
		}
	} catch (error) {
		console.error(error);
		signale.fatal(error);
		message.react('😠');
		message.reply('there was an error executing that command');
	}
});

// client.destroy();
