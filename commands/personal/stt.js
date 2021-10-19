const search = require("youtube-search");
const httpRequestsHelper = require("../../helpers/http-requests-helper");
const { hassIoToken, hassIoEndpoints } = require("../../secrets.json");

module.exports = {
  name: "stt",
  description: "Send to tv",
  enabled: false,
  execute(config, message, args) {
    let videoUrl = "https://www.youtube.com/watch?v=CYqq9Ovz_9c";

    let url = hassIoEndpoints.PLAY_MEDIA;
    let jsonData = {
      entity_id: `media_player.bedroom_display`,
      media_content_id: videoUrl,
      media_content_type: "video",
    };
    const data = JSON.stringify(jsonData);

    httpRequestsHelper
      .sendPostWithHeader(url, data, { Authorization: `Bearer ${hassIoToken}` })
      .then(() => {
        signale.success("Light command executed successfully");
      })
      .catch((error) => {
        signale.error("Error executing light command", error);
      });
  },
};
