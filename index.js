const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const { token } = require('./secrets.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands');


for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}


client.on('message', (message) => {

	client.user.setUsername('Michael Rosen');
	client.user.setActivity('with hot food');
	if(!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if(!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(client, message, args);
	}
	catch (error) {
		console.error(error);
		message.react('angry');
		message.reply('there was an error executing that command');
	}

});

client.login(token);
client.destroy();