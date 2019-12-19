const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { token } = require('./secrets.json');
const signale = require('signale');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const baseCommandFiles = fs.readdirSync('./commands');
const queueCommandFiles = fs.readdirSync('./commands/queue');
const debugCommandFiles = fs.readdirSync('./commands/debug');

const config = {};
const queue = new Map();

for (const file of baseCommandFiles) {
	if (path.extname(file) === '.js') {
		const command = require(`./commands/${ file }`);
		if (command.enabled) {
			client.commands.set(command.name, command);
		}
	}
}

for (const file of queueCommandFiles) {
	if (path.extname(file) === '.js') {
		const command = require(`./commands/queue/${ file }`);
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


client.on('message', (message) => {

	signale.info('Message sent from %s: %s', message.author.username, message.content);
	const serverQueue = queue.get(message.guild.id);

	client.user.setUsername('Michael Rosen');
	client.user.setActivity('with hot food');
	config.queue = queue;
	config.serverQueue = serverQueue;
	config.commands = client.commands;
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		signale.success('Command: %s. Args: %s', command, args);
		client.commands.get(command).execute(config, message, args);
	} catch (error) {
		console.error(error);
		signale.fatal(error);
		message.react('angry');
		message.reply('there was an error executing that command');
	}

});

client.login(token);
client.destroy();