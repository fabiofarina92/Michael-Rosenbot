const moment = require("moment");
const httpRequestsHelper = require("../../helpers/http-requests-helper");

module.exports = {
  name: "hair",
  description: "Get dumb hair cut appointment times",
  usage: "hair",
  enabled: true,
  execute(config, message, args) {
    const NOW = moment().format("YYYY-MM-DD");
    const EIGHT_WEEKS_FROM_NOW = moment().add(8, "weeks").format("YYYY-MM-DD");
    httpRequestsHelper.sendBasicGet(`https://api.fresha.com/locations/348940/timeslot-availability?offer-item-ids=sv%3A5163833&date-from=${NOW}&date-to=${EIGHT_WEEKS_FROM_NOW}`).then((response) => {
      let foundAppointment = null;
      response.data.data.some(function (data) {
        if (data.attributes?.timeslots?.length > 0) {
          foundAppointment = data;
        }
        return foundAppointment !== null;
      });

      if (foundAppointment) {
        let formattedMessage = `Found appointment for you on ${moment(foundAppointment.id).format("dddd [the] Do MMM, YYYY")}`;
        let avaiableTimes = `Times available: `;
        foundAppointment.attributes.timeslots.forEach((slot) => {
          let date = new Date(null);
          date.setSeconds(slot);
          let result = date.toISOString().substr(11, 5);
          avaiableTimes = avaiableTimes.concat(`\`${result}\`,`);
        });
        avaiableTimes = avaiableTimes.substr(0, avaiableTimes.length - 1);
        message.channel.send(formattedMessage);
        message.channel.send(avaiableTimes);
      }
    });
  },
};
