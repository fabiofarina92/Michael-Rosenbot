const signale = require("../../helpers/logger");
const httpRequestsHelper = require("../../helpers/http-requests-helper");
const { hassIoToken, hassIoEndpoints } = require("../../secrets.json");

module.exports = {
  name: "hstatus",
  description: "Check status of house",
  usage: "hstatus",
  enabled: true,
  execute(config, message, args) {
    let stateObjects = {
      studyLight: { entityId: "light.study", displayName: "Light in study" },
      bathroomLight: {
        entityId: "light.bathroom",
        displayName: "Light in bathroom",
      },
      bedroomLight: {
        entityId: "light.bedroom",
        displayName: "Light in bedroom",
      },
      speedTestDownload: {
        entityId: "sensor.speedtest_download",
        displayName: "Network download",
      },
      speedTestUpload: {
        entityId: "sensor.speedtest_upload",
        displayName: "Network upload",
      },
      speedTestPing: {
        entityId: "sensor.speedtest_ping",
        displayName: "Network ping",
      },
      piHoleBlockedAds: {
        entityId: "sensor.pi_hole_ads_blocked_today",
        displayName: "Ads blocked today",
      },
    };
    let url = hassIoEndpoints.STATES;

    httpRequestsHelper
      .sendGetWithHeader(url, { Authorization: `Bearer ${hassIoToken}` })
      .then((response) => {
        // signale.info(response.data);
        let responseList = "";
        Object.keys(stateObjects).forEach((stateItem) => {
          response.data.forEach((state) => {
            if (state.entity_id == stateObjects[stateItem].entityId) {
              // console.log(
              //   `${stateObjects[stateItem].displayName}: \`${state.state}\``
              // );
              // message.channel.send(
              //   `${stateObjects[stateItem].displayName}: \`${state.state}\``
              // );
              signale.info(state);
              responseList = responseList.concat(`${stateObjects[stateItem].displayName}: \`${state.state}\`\n`);
            }
          });
        });
        responseList = responseList.concat("Fridge mode: `sexy`");
        message.channel.send(responseList);
      })
      .catch((error) => {
        signale.error("Error executing light command", error);
      });
  },
};
