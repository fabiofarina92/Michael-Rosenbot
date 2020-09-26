module.exports = {
	name: 'fridge',
	description: 'ERP Fridge',
	enabled: true,
	execute(config, message, args) {
		let fridgeLinks = ['https://youtu.be/LuLtt_bSByw?t=26', 'https://www.youtube.com/watch?v=TiC8pig6PGE&vl=en' ]
		message.channel.send(fridgeLinks[Math.floor(Math.random() * fridgeLinks.length)])
	},
};
