const httpRequestsHelper = require('../../helpers/http-requests-helper');
module.exports = {
	name: 'skip',
	description: 'Skip current song',
	enabled: true,
	async execute(config, message, args) {
				config.serverQueue.songs.shift();
				httpRequestsHelper.play(config.serverQueue, config.serverQueue.songs[0], message)
	},
};
