
const request = require('request');
const httpRequestsHelper = require('../helpers/http-requests-helper');
const { hassIoToken } = require('../secrets.json');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
	name: 'light',
	description: 'Turn on lights',
	enabled: false,
	execute(config, message, args) {
        console.log('hit');
        let request = new XMLHttpRequest();
        request.open('POST', 'http://192.168.0.146/api/services/switch/turn_on');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Authorization', 'Bearer ' + hassIoToken);

        console.log(request);

        request.send('{"entity_id": "light.study"}')
        const url = 'http://192.168.0.146/api/services/switch/turn_on';

        const formData = {
            entity_id: 'light.study',
            media_content_id: videoUrl,
            media_content_type: 'video/best'
        };

        const options = {
            method: 'post',
            body: formData,
            json: true,
            url: url
        };

        request()
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
};
