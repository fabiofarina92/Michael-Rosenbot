const signale = require('signale');
const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
	name: 'quote',
	description: 'Generate a flashy image with a quote',
	usage: '--quote "Here is my quote"',
	enabled: true,
	async execute(config, message, args) {
		if (!message.channel) return;

		let targetUser = message.mentions.users.first();
		let targetUserGuild = message.guild.member(message.author);
		let textStart = 0;

		if (targetUser) {
			targetUserGuild = message.guild.member(targetUser);
			textStart = 1;
		} else {
			targetUser = message.author;
		}

		const quote = args.slice(textStart, args.length).join(' ');
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage('assets/basic-background.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		const quoteLines = getLines(ctx, quote, (canvas.width / 5.5));
		signale.info(quoteLines);
		const builtQuote = `${ quoteLines.join('\r\n') } \r\n — ${ targetUserGuild.displayName }`;
		ctx.font = applyText(canvas, builtQuote);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(builtQuote, canvas.width / 2.5, canvas.height / (1.8 * quoteLines.length));

		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(targetUser.displayAvatarURL);
		ctx.drawImage(avatar, 40, 40, 200, 200);

		const attachment = new Discord.Attachment(canvas.toBuffer(), 'test.png');

		message.channel.send(`Here you go!`, attachment);
		message.delete(1000);
	},
};

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);
};

const getLines = (ctx, text, maxWidth) => {
	const lines = [];
	if (!text) return lines;

	// Start calculation
	while (text.length) {
		let i;
		for (i = text.length; ctx.measureText(text.substr(0, i)).width > maxWidth; i -= 1) ;

		const result = text.substr(0, i);

		let j;
		if (i !== text.length) for (j = 0; result.indexOf(' ', j) !== -1; j = result.indexOf(' ', j) + 1) ;

		lines.push(result.substr(0, j || result.length));

		// moves to separate line instead of just cutting it off to new line
		// let width = Math.max( width, ctx.measureText(lines[ lines.length-1 ]).width );
		text = text.substr(lines[lines.length - 1].length, text.length);
	}

	return lines;
};
