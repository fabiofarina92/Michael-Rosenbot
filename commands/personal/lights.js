const signale = require("signale");
const httpRequestsHelper = require("../../helpers/http-requests-helper");
const { hassIoToken, hassIoEndpoints } = require("../../secrets.json");

module.exports = {
  name: "light",
  description: "Turn on lights",
  usage: "light [room*, colour, preset, brightness]",
  enabled: true,
  elevated: true,
  execute(config, message, args) {
    let { foundRoom, foundColour, foundPreset, foundBrightness } = parseArguments(args);

    let { url, colour } = getCorrectEndPoint(foundPreset, foundColour, foundBrightness);
    foundColour = colour;

    let jsonData = { entity_id: `light.${foundRoom.name}` };
    if (foundColour) {
      jsonData.color_name = foundColour;
    }
    if (foundBrightness) {
      jsonData.brightness_pct = foundBrightness;
    }
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
  foundPreset = null;
  foundBrightness = null;
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
    colours: ["red", "green", "blue", "purple", "yellow", "white"],
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
      foundPreset = arg;
    }
    if(!isNaN(arg)) {
      foundBrightness = arg;
    }
  });
  if (!foundRoom.rbg) {
    foundColour = null;
  }
  return { foundRoom, foundColour, foundPreset, foundBrightness };
}

function getCorrectEndPoint(preset, colour, brightness) {
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
    if (brightness) {
      url = hassIoEndpoints.LIGHT_ON;
    }
  }
  return { url, colour };
}
