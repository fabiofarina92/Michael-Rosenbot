const fs = require("fs");
const Discord = require("discord.js");
const { default: YouTube } = require("youtube-sr");
const ytdl = require("ytdl-core");
const httpRequestsHelper = require("../../helpers/http-requests-helper");
const signale = require("../../helpers/logger");

module.exports = {
  name: "dl",
  description: "Link any downloaded files",
  usage: "dl | dl ls | dl rm # | dl add content | dl #",
  enabled: true,
  async execute(config, message, args) {
    if (args.length > 0) {
      switch (args[0].toUpperCase()) {
        case "LS":
          runListCommand(message);
          break;
        case "RM":
          runRemoveCommand(message, args[1]);
          break;
        case "ADD":
          await runAddCommand(message, args.slice(1).join(" "));
          break;
        default:
          runRetrieveFileCommand(message, retrieveFileByNumber(message, args[0]));
      }
    } else {
      message.channel.send("Which file would you like to get?");
      message.channel.send(formatList(message));
      const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, {
        max: 1,
        time: 10000,
      });
      collector.on("collect", (responseMessage) => {
        runRetrieveFileCommand(message, retrieveFileByNumber(message, responseMessage.content));
      });
    }
  },
};

const runListCommand = (message) => {
  message.channel.send(formatList(message));
};

const runAddCommand = async (message, query) => {
  if (!query) {
    message.channel.send(`No video provided`);
    return;
  }

  let allFiles = getAll(message);
  if (allFiles.length >= 30) {
    message.channel.send(`There seems to be too many files stored on the server. Please download them to your local machine and delete them from the server`);
    return;
  }

  let fileName = "";
  switch (await getVideoType(message, query)) {
    case "YOUTUBE":
      let foundVideo = await searchYoutube(message, query);

      if (!foundVideo) {
        message.channel.send(`Video \`${query}\` not found`);
        return;
      }
      if (foundVideo.duration > 10 * 60 * 1000) {
        message.channel.send(`Minimum clip length is 10 minutes. Try a shorter video!`);
        return;
      }
      message.channel.send(`Downloading: \`${foundVideo.title}\``);
      let download = ytdl(`https://www.youtube.com/watch?v=${foundVideo.id}`, { filter: "audioonly", format: "mp3" });

      fileName = foundVideo.title.replace(/[/\\?%*:|"<>]/g, "-");
      let downloadStream = download.pipe(fs.createWriteStream(`./data/${message.guild.id}/data/${fileName}.mp3`));

      downloadStream.on("finish", () => {
        message.channel.send("Download complete!");
        message.channel.send("Downloaded clip:", { files: [`./data/${message.guild.id}/data/${fileName}.mp3`] });
        downloadStream.close();
      });
      break;
    case "URL":
      let fixedQuery = "";
      let downloadSuccessful = false;
      if (query.indexOf("http://") >= 0 || query.indexOf("https://") >= 0) {
        fixedQuery = query;
      } else {
        fixedQuery = "https://" + query;
      }

      if (!isUrl(fixedQuery)) {
        message.channel.send(`Invalid url provided ${fixedQuery}`);
        return;
      }
      fileName = query.split("/").at(-1);
      let writeStream = fs.createWriteStream(`./data/${message.guild.id}/data/${fileName}`);
      httpRequestsHelper.sendAsyncGetWithHeaderAndBody(fixedQuery, { responseType: "stream", "conent-length": 5 }).then(async (response) => {
        let MAX_FILE_SIZE = 1024 * 1024 * 5;
        if (!response.headers["content-length"] || response.headers["content-length"] > MAX_FILE_SIZE) {
          message.channel.send(`File size exceeds the ${MAX_FILE_SIZE} bytes limit`);
          writeStream.close();
        } else {
          response.data.pipe(writeStream);
          downloadSuccessful = true;
        }
      });

      writeStream.on("finish", () => {
        if (downloadSuccessful) {
          message.channel.send("Download complete!");
          message.channel.send("Downloaded clip:", { files: [`./data/${message.guild.id}/data/${fileName}`] });
        } else {
          fs.unlinkSync(`./data/${message.guild.id}/data/${fileName}`);
        }
        writeStream.close();
      });
      break;
  }
};

const runRemoveCommand = (message, number) => {
  const selectedFile = retrieveFileByNumber(message, number);
  const filePath = `./data/${message.guild.id}/data/${selectedFile}`;

  if (fs.existsSync(filePath)) {
    message.channel.send(`Please confirm that you wish to delete: \`${selectedFile}\` [Y]`);
    const collector = new Discord.MessageCollector(message.channel, (m) => m.author.id === message.author.id, {
      max: 1,
      time: 10000,
    });
    collector.on("collect", (responseMessage) => {
      if (responseMessage.content === "Y") {
        fs.unlinkSync(filePath);
        message.reply(`File \`${selectedFile}\` was deleted`);
      } else {
        message.reply(`Deletion aborted`);
      }
    });
  }
};

const runRetrieveFileCommand = (message, selectedFile) => {
  if (selectedFile) {
    message.channel.send(`Retrieving \`${selectedFile}\``);
    message.channel.send(selectedFile, { files: [`./data/${message.guild.id}/data/${selectedFile}`] });
  }
};

const getAll = (message) => {
  return fs.readdirSync(`./data/${message.guild.id}/data/`);
};

const formatList = (message) => {
  let counter = 1;
  let formattedString = "";
  getAll(message).forEach((files) => {
    formattedString += `${counter++}: \`${files}\`\r\n`;
  });
  return formattedString;
};

const retrieveFileByNumber = (message, number) => {
  if (isNaN(number)) {
    message.reply(`Value \`${number}\` is not an integer.`);
    return;
  }

  let selected = Number(number) - 1;
  let allFiles = getAll(message);

  if (selected > allFiles.length) {
    message.reply(`There are only \`${allFiles.length}\` files. Number \`${selected}\` not found!`);
    return;
  }

  let selectedFile = allFiles[selected];
  return selectedFile;
};

const searchYoutube = async (message, query) => {
  const videos = await YouTube.search(query, { limit: 1 }).catch(async function () {
    message.reply("Error processing your request");
  });
  if (!videos) {
    message.reply("Couldn't find the video specified. Try again");
    return;
  }

  return videos[0];
};

const getVideoType = async (message, query) => {
  let urlMatch = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

  if (query.indexOf("youtube.com") >= 0 || query.indexOf("youtu.be") >= 0) {
    return "YOUTUBE";
  }

  if (isUrl(query)) {
    return "URL";
  } else {
    return "YOUTUBE";
  }
};

const isUrl = (url) => {
  let urlMatch = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;

  return url.match(urlMatch);
};
