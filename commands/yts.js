const search = require('youtube-search');
const { youtubetoken } = require('../secrets.json');

module.exports = {
	name: 'yts',
	description: 'Youtube Search',
	execute(client, message, args) {

        const opts = {
            maxResults: 10,
            key: youtubetoken,
        };

        search(args[0], opts, function(err, results) {
            if(err) return console.log(err);

            console.dir(results);
        })
		
		message.delete(1000);
	},
};