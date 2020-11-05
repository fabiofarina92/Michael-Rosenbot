const Discord = require('discord.js');
const Canvas = require('canvas');

async function generateImage(channel, member, text) {
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');
	const background = await Canvas.loadImage('../../assets/basic-background.png');

	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'test.png');

	channel.send(`This is a test message`, attachment)
}