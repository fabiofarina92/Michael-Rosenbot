const search = require('youtube-search');
const { youtubetoken } = require('../secrets.json');

module.exports = {
    searchYoutube(description, message, callback) {
        const opts = {
            maxResults: 1,
            key: youtubetoken,
        };
    
        search(description, opts, function(err, results) {
            if(err) return console.log(err);
    
            message.channel.send("This is what I found: " + results[0].link);
            callback(results[0].link);        
        });
    }
}