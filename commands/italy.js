module.exports = {
	name: '🤌',
	description: 'Whatsammatteryou???',
	enabled: true,
	execute(config, message, args) {
		message.react('🇮🇹')
		message.channel.send('BABATY BOOPY SPAGHETT' + args);
	},
};
