const httpRequestsHelper = require("../../helpers/http-requests-helper");
const signale = require("../../helpers/logger");
const { binFormat } = require("../../utils/embed-formatter");

module.exports = {
  name: "bin",
  description: "Fetch weekly bin schedule",
  usage: "bin suburb",
  enabled: true,
  execute(config, message, args) {
    if (args.length === 0) {
      message.channel.send("Please specify a suburb and try again.");
      return;
    }
    let selectedSuburb = args[0];
    let foundSuburb = false;
    httpRequestsHelper.sendBasicGet("https://www.data.act.gov.au/resource/jzzy-44un.json").then((response) => {
      response.data.every((suburb) => {
        if (suburb.suburb.toUpperCase() === selectedSuburb.toUpperCase()) {
          message.channel.send(binFormat(suburb));
          foundSuburb = true;
          return false;
        }
        return true;
      });
    });
    if (!foundSuburb) {
      message.reply(`Suburb ${selectedSuburb} not found`);
    }
  },
};
