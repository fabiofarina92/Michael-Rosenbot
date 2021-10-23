const httpRequestsHelper = require("../../helpers/http-requests-helper");
const signale = require("../../helpers/logger");

module.exports = {
  name: "price",
  description: "Get the average price of the symbol",
  usage: "price <symbol>",
  enabled: true,
  execute(config, message, args) {
    httpRequestsHelper.sendBasicGet(`https://api.binance.com/api/v3/avgPrice?symbol=${args[0]}`).then((response) => {
      let sendMessage = `Price of ${args[0]}: \`$${parseFloat(response.data.price).toFixed(2)}\``;
      message.channel.send(sendMessage);
    }).catch(() => {
      message.channel.send('Something went wrong. Are you sure you inputted the right symbol?')
    });
  },
};
