const signale = require("signale");
const httpRequestsHelper = require("../../helpers/http-requests-helper");
const { hassIoToken, hassIoEndpoints } = require("../../secrets.json");

module.exports = {
  name: "light",
  description: "Turn on lights",
  enabled: true,
  execute(config, message, args) {
    let { foundRoom, foundColour, preset } = parseArguments(args);

    let { url, colour } = getCorrectEndPoint(preset, foundColour);
    foundColour = colour;

    let jsonData = foundColour
      ? { entity_id: `light.${foundRoom.name}`, color_name: foundColour }
      : { entity_id: `light.${foundRoom.name}` };
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

function parseArguments(args) {
  foundRoom = null;
  foundColour = null;
  preset = null;
  let matcher = {
    rooms: {
      bedroom: { name: "bedroom", match: ["bed", "bedroom"], rgb: false },
      bathroom: {
        name: "bathroom",
        match: ["bath", "bathroom", "toilet"],
        rbg: false,
      },
      study: { name: "study", match: ["study", "computer"], rbg: true },
    },
    colours: ["red", "green", "blue", "purple"],
    presets: ["on", "off", "toggle"],
  };
  args.forEach((arg) => {
    Object.keys(matcher.rooms).forEach((room) => {
      if (matcher.rooms[room].match.includes(arg)) {
        foundRoom = matcher.rooms[room];
      }
    });
    if (matcher.colours.includes(arg)) {
      foundColour = arg;
    }
    if (matcher.presets.includes(arg)) {
      preset = arg;
    }
  });
  if (!foundRoom.rbg) {
    foundColour = null;
  }
  return { foundRoom, foundColour, preset };
}

function getCorrectEndPoint(preset, colour) {
  let url = hassIoEndpoints.LIGHT_ON;
  if (preset) {
    switch (preset) {
      case "on":
        url = hassIoEndpoints.LIGHT_ON;
        break;
      case "off":
        url = hassIoEndpoints.LIGHT_OFF;
        colour = null;
        break;
      case "toggle":
        url = hassIoEndpoints.LIGHT_TOGGLE;
        break;
      default:
        url = hassIoEndpoints.LIGHT_ON;
        break;
    }
  } else {
    if (!colour) {
      url = hassIoEndpoints.LIGHT_TOGGLE;
    }
  }
  return { url, colour };
}
