const httpRequestsHelper = require("../../helpers/http-requests-helper");
const signale = require("../../helpers/logger");
const { tmdbApi } = require("../../secrets.json");
const embedFormatter = require("../../utils/embed-formatter");

module.exports = {
  name: "movie",
  description: "Get information for a movie",
  usage: "movie <name>",
  enabled: true,
  execute(config, message, args) {
    const query = args.join(" ");
    httpRequestsHelper.sendBasicGet(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbApi}&query=${query}`).then((response) => {
      const movie = response?.data?.results[0];
      if (movie) {
        message.channel.send(embedFormatter.movieFormat(movie));
      } else {
        signale.info(`Nothing found for query: ${query}`);
        message.channel.send(`Nothing could be found for your query: ${query}`);
      }
    });
  },
};
