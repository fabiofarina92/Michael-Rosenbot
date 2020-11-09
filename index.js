const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const configuration = require('./config.json');
const { token } = require('./secrets.json');
const signale = require('signale');

const client = new Discord.Client();
client.login(token);
client.commands = new Discord.Collection();

const baseCommandFiles = fs.readdirSync('./commands');
const debugCommandFiles = fs.readdirSync('./commands/debug');
const personalCommandFiles = fs.readdirSync('./commands/personal');

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

client.on('message', (message) => {
	signale.info(message.author);
	const val = Math.floor(Math.random() * 10);
	if (message.author.id == configuration.JOSH) {
		if (val <= 3) {
			message.react('🖕');
		}
	}
	client.user.setUsername('Michael Rosen');
	client.user.setActivity('with hot food');
	config.commands = client.commands;
	if (!message.content.startsWith(configuration.PREFIX) || message.author.bot) return;
	signale.info('Message sent from %s: %s', message.author.username, message.content);
	const args = message.content.slice(configuration.PREFIX.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command) && message.author.id == configuration.JOSH) {
		message.react('🖕');
		message.reply("That's the wrong command, Josh!");
		return;
	}
	if (!client.commands.has(command)) return;

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
