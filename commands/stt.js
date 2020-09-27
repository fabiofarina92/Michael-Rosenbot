const request = require('request');
const search = require('youtube-search');
const youtubeHelper = require('../helpers/youtube-helper');
const httpRequestsHelper = require('../helpers/http-requests-helper');

module.exports = {
	name: 'stt',
	description: 'Send to tv',
	enabled: false,
	execute(config, message, args) {

		var video = 'https://www.youtube.com/watch?v=CYqq9Ovz_9c';

		if (args[0]) {
			const fullString = args.join(' ');

			youtubeHelper.searchYoutube(fullString, message, function (response) {
				httpRequestsHelper.sendHassMediaRequest(response);
			});
		} else {
			httpRequestsHelper.sendHassMediaRequest(video);
		}

	},
};
