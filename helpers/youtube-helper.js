const search = require('youtube-search');
const { youtubetoken } = require('../secrets.json');

module.exports = {
    searchYoutube(description, message, callback) {
        if(description === '') return;
        const opts = {
            maxResults: 1,
            key: youtubetoken,
        };
    
        search(description, opts, function(err, results) {
            if(err) return console.log(err);
            callback(results[0].link);        
        });
    },

    searchFullYoutube(description, message, callback) {
        if(description === '') return;
        const opts = {
            maxResults: 1,
            key: youtubetoken,
        };
    
        search(description, opts, function(err, results) {
            if(err) return console.log(err);
            callback(results[0]);        
        });
    }
}