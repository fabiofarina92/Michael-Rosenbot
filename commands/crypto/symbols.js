const httpRequestsHelper = require("../../helpers/http-requests-helper");
const signale = require("../../helpers/logger");

module.exports = {
  name: "symbols",
  description: "Get a list of symbols",
  usage: "symbols",
  enabled: true,
  execute(config, message, args) {
  	if (args.length !== 1) {
  		message.channel.send('A partial symbol is required to search against');
  		return;
	  }
  	if (args[0].length < 3) {
  		message.channel.send('At least 3 characters are required....dick');
  		return;
	  }
  	let partialSymbol = args[0].toUpperCase();
    httpRequestsHelper.sendBasicGet(`https://api.binance.com/api/v3/exchangeInfo`).then((response) => {
    	let sendMessage = '';
    	response.data.symbols.forEach((symbol) => {
    		if (symbol.symbol.includes(partialSymbol)) {
			    sendMessage += `\`${symbol.symbol}\` `;
		    }
    		if (sendMessage.length > 1000) {
    			message.channel.send(sendMessage);
    			sendMessage = ''
		    }
      })
	    message.channel.send(sendMessage);
    }).catch((error) => {
      signale.error(error)
      message.channel.send('Something went wrong.');
    });
  },
};
