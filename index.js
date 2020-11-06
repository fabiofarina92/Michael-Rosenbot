const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
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
	client.user.setUsername('Michael Rosen');
	client.user.setActivity('with hot food');
	config.commands = client.commands;
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	signale.info('Message sent from %s: %s', message.author.username, message.content);
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		signale.success('Command: %s. Args: %s', command, args);
		client.commands.get(command).execute(config, message, args);
	} catch (error) {
		console.error(error);
		signale.fatal(error);
		message.react('😠');
		message.reply('there was an error executing that command');
	}
});

// client.destroy();
