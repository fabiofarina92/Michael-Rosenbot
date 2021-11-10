const httpRequestsHelper = require("../../helpers/http-requests-helper");
const signale = require("../../helpers/logger");
const { tmdbApi } = require("../../secrets.json");
const embedFormatter = require("../../utils/embed-formatter");
const Discord = require("discord.js");
const { shuffle } = require("../../utils/utils");

module.exports = {
  name: "suggest-movie",
  description: "Get information for a movie",
  usage: "suggest-movie",
  enabled: true,
  execute(config, message, args) {
    let genre,
      actor,
      altGenre = undefined;
    let actorList = [];
    let movieList = [];
    findGenre("What genre would you like?", message)
      .then((result) => {
        genre = result;
        const rnd1to50 = Math.floor(Math.random() * (50 - 1 + 1) + 1);
        const endPoint = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApi}&with_genres=${genre.id}&include_adult=false&page=${rnd1to50}`;
        httpRequestsHelper.sendAsyncGet(endPoint).then((allByGenre) => {
          movieList = allByGenre.data.results;
          allByGenre.data.results.forEach((movie) => {
            httpRequestsHelper.sendAsyncGet(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${tmdbApi}`).then(async (cast) => {
              let firstCastOrCrew = cast.data.cast[0].name || cast.data.crew[0].name;
              // let secondCastOrCrew = cast.data.cast[1].name || cast.data.crew[1].name;
              actorList.push(firstCastOrCrew);
              // if (!actorList.includes(secondCastOrCrew)) {
              //   actorList.push(secondCastOrCrew);
              // }
            });
          });
          const shuffledArray = shuffle(allByGenre.data.results);
          const movieOne = shuffledArray.pop();
          const movieTwo = shuffledArray.pop();
          const movieThree = shuffledArray.pop();

          message.channel.send(`Here are your options: `);
          message.channel.send(embedFormatter.movieFormat(movieOne));
          message.channel.send(embedFormatter.movieFormat(movieTwo));
          message.channel.send(embedFormatter.movieFormat(movieThree));
          signale.info(actorList);
        });
      })
      .catch((error) => {
        signale.error(error);
      });
  },
};

const findGenre = (query, message) => {
  return new Promise((resolve, reject) => {
    let foundGenre = undefined;
    message.channel.send(query);
    const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, {
      max: 1,
      time: 10000,
    });
    collector.on("collect", (responseMessage) => {
      httpRequestsHelper.sendBasicGet(`https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbApi}`).then((response) => {
        function matcher(value) {
          return value.name.toUpperCase() === responseMessage.content.toUpperCase();
        }

        foundGenre = response.data.genres.find(matcher);
        if (!foundGenre) {
          message.reply(`Genre \`${responseMessage.content}\` was not found.`);
          reject(`Genre \`${responseMessage.content}\` was not found.`);
        } else {
          resolve(foundGenre);
        }
      });
    });
  });
};
