const httpRequestsHelper = require("../../helpers/http-requests-helper");

module.exports = {
  name: "24hr",
  description: "Get 24hr price change statistics",
  usage: "24hr <symbol>",
  enabled: true,
  elevated: true,
  execute(config, message, args) {
    httpRequestsHelper.sendBasicGet(`https://api.binance.com/api/v3/ticker/24hr?symbol=${args[0]}`).then((response) => {
      let sendMessage = '';
      let data = response.data;
      Object.keys(response.data).forEach((key) => {
      	sendMessage += `\`${key}\`: ${data[key]}\r\n`;
      });
      message.channel.send(sendMessage);
    }).catch(() => {
      message.channel.send('Something went wrong. Are you sure you inputted the right symbol?')
    });
  },
};
