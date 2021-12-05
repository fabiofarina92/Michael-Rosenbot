const httpRequestsHelper = require("../../helpers/http-requests-helper");
const signale = require("../../helpers/logger");

module.exports = {
  name: "poll",
  description: "Create a simple selection poll",
  usage: "poll question [response1; response2; response3]",
  enabled: true,
  execute(config, message, args) {
    if (args.length < 3) return;
    // if (!args.includes("[")) return;
    // if (!args.includes("]")) return;

    let joinedString = args.join(" ");
    let question = joinedString.substr(0, joinedString.indexOf("[")).trimRight();
    let answers = joinedString.substr(joinedString.indexOf("[") + 1, joinedString.indexOf("]") - joinedString.indexOf("[") - 1).split(";");

    let pollString = question + "\r\n\r\n";
    let emojiArray = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

    let count = 0;
    answers.forEach((answer) => {
      pollString += `${emojiArray[count++]} ${answer} \r\n`;
    });
    count = 0;

    let sentMessage = message.channel.send(pollString);

    sentMessage.then((m) => {
      answers.forEach(() => {
        m.react(emojiArray[count++]);
      });
    });
  },
};
