const fs = require('fs');
const path = require('path');
const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const configuration = require('./config.json');
const { token } = require('./secrets.json');
const signale = require('signale');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on('raw', (packet) => {
	if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
	const channel = client.channels.cache.get(packet.d.channel_id);
	// There's no need to emit if the message is cached, because the event will fire anyway for that
	if (channel.messages.cache.has(packet.d.message_id)) return;
	// Since we have confirmed the message is not cached, let's fetch it
	channel.messages.fetch(packet.d.message_id).then(message => {
		// Emojis can have identifiers of name:id format, so we have to account for that case as well
		const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
		// This gives us the reaction we need to emit the event properly, in top of the message object
		const reaction = message.reactions.cache.get(emoji);
		// Adds the currently reacting user to the reaction's users collection.
		if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
		// Check which type of event it is before emitting
		if (packet.t === 'MESSAGE_REACTION_ADD') {
			client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
		}
		if (packet.t === 'MESSAGE_REACTION_REMOVE') {
			client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
		}
	});
})

client.on('messageReactionAdd', async (reaction, user) => {
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	if (reaction.message.channel === configuration.PINS_CHANNEL) return;
	if (user.username === 'prae' || user.username === 'jahoo' || user.username === 'rgrwco' || user.username === 'Dezine') {
		if (reaction.emoji.name === '📌') {

			const embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Pinned Message')
					.setURL(reaction.message.url)
					.setAuthor(reaction.message.author.username, reaction.message.author.avatarURL())
					.setTimestamp()
					.setDescription(reaction.message.content);

			if (reaction.message.content === '') {
				embed.setDescription('image')
			}
			if (reaction.message.attachments.first()) {
				signale.info(reaction.message.attachments.first().attachment);
				embed.setImage(reaction.message.attachments.first().attachment);
			}

			// client.channels.cache.get('894783602708070460').send(embed);
			client.channels.cache.get('894793988580716564').send(embed);
		}
	}


})

client.login(token);
client.commands = new Collection();

const baseCommandFiles = fs.readdirSync('./commands');
const debugCommandFiles = fs.readdirSync('./commands/debug');
const personalCommandFiles = fs.readdirSync('./commands/personal');
const musicCommandFiles = fs.readdirSync('./commands/music');
const customCommandsFile = fs.readdirSync('./commands/custom');

const config = {};
config.songQueue = [];

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

for (const file of musicCommandFiles) {
	if (path.extname(file) === '.js') {
		const command = require(`./commands/music/${ file }`);
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
	if (message.author.bot) return;
	commandDB.get('customCommands').value().forEach((cmd) => {
		if (message.content && cmd.command.toUpperCase() === message.content.toUpperCase()) {
			message.channel.send(cmd.result);
		}
	})
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
