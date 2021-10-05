const signale = require('signale');
const request = require('request');
const axios = require('axios');
const ytdl = require('ytdl-core');

module.exports = {
	sendStandardRequest(endpoint, callback) {
		request(endpoint, function (error, response, body) {
			const content = JSON.parse(body);
			signale.info('Response content: %s', content);
			callback(content);

		});
	},
	sendPostRequestAsCallback(endPoint, data, callback) {
		let xhr = new XMLHttpRequest();
		xhr.open("POST", endPoint, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				let json = JSON.parse(xhr.responseText);
				callback(json);
			}
		}
		xhr.send(JSON.stringify(data));
	},
	sendBasicGet(endPoint) {
		return axios.get(endPoint);
	},
	sendBasicPost(endPoint, data) {
		return axios.post(endPoint, data);
	},
	sendGetWithHeader(endPoint, headers) {
		return axios.get(endPoint, { headers: headers});
	},
	sendPostWithHeader(endPoint, data, headers) {
		return axios.post(endPoint, data, { headers: headers});
	},

	play(serverQueue, song) {
	if (!song) {
		serverQueue.playing = false;
		serverQueue.voiceChannel.leave();
	}
	const stream = ytdl(song.url, { filter: 'audioonly' });
	serverQueue.playing = true;
	serverQueue.connection.play(stream)
			.on('end', () => {
				serverQueue.songs.shift();
				play(serverQueue, serverQueue.songs[0])
			})
			.on('error', (error) => {
				signale.error(error)
			})
}

};
