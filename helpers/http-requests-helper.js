const signale = require('signale');
const request = require('request');
const { hassMediaExtractor, hassChromeCast } = require('../secrets.json');

module.exports = {

	sendHassMediaRequest(videoUrl) {
		const url = hassMediaExtractor;

		const formData = {
			entity_id: hassChromeCast,
			media_content_id: videoUrl,
			media_content_type: 'video/best'
		};

		const options = {
			method: 'post',
			body: formData,
			json: true,
			url: url
		};

		request(options, function (err, res, body) {
			if (err) {
				console.error('error posting json: ', err);
				throw err
			}
			var headers = res.headers;
			var statusCode = res.statusCode;
			console.log('headers: ', headers);
			console.log('statusCode: ', statusCode);
			console.log('body: ', body)
		})
	},

	sendStandardRequest(endpoint, callback) {
		request(endpoint, function (error, response, body) {
			// console.log('error:', error); // Print the error if one occurred
			// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

			const content = JSON.parse(body);
			// console.log('body:', content); // Print the HTML for the Google homepage.
			// console.log('string body', content.message);

			signale.info('Response content: %s', content);
			callback(content);

		});
	}

};