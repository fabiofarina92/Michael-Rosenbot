const request = require('request');
const { hassMediaExtractor, hassChromeCast } = require('../secrets.json');

module.exports = {

    sendMediaRequest(videoUrl) {
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
		}

		request(options, function (err, res, body) {
			if (err) {
				console.error('error posting json: ', err)
				throw err
			}
			var headers = res.headers
			var statusCode = res.statusCode
			console.log('headers: ', headers)
			console.log('statusCode: ', statusCode)
			console.log('body: ', body)
		})
    }

}