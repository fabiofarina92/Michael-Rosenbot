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
    let { foundRoom, foundColour, foundState, foundBrightness, foundPreset } = parseArguments(args);

    let { url, colour } = getCorrectEndPoint(foundState, foundColour, foundBrightness, foundPreset);
    foundColour = colour;

    let jsonData = { entity_id: `light.${foundRoom.name}` };
    if (foundColour) {
      jsonData.color_name = foundColour;
    }
    if (foundBrightness) {
      jsonData.brightness_pct = foundBrightness;
    }
    if (foundPreset) {
      Object.assign(jsonData, foundPreset);
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
  foundState = null;
  foundBrightness = null;
  foundPreset = null;
  let matcher = {
    rooms: {
      bedroom: { name: "bedroom", match: ["bed", "bedroom"], rgb: false },
      bathroom: {
        name: "bathroom",
        match: ["bath", "bathroom", "toilet"],
        rgb: false,
      },
      study: { name: "study", match: ["study", "computer"], rgb: true },
    },
    colours: ["red", "green", "blue", "purple", "yellow", "white"],
    states: ["on", "off", "toggle"], 
    presets: ["cozy", "bright", "warm", "fridge"],
  };
  args.forEach((arg) => {
    Object.keys(matcher.rooms).forEach((room) => {
      if (matcher.rooms[room].match.includes(arg)) {
        foundRoom = matcher.rooms[room];
      }
    });
    if (matcher.colours.includes(arg) && foundColour) {
      foundColour = arg;
    }
    if (matcher.states.includes(arg) && !foundState) {
      foundState = arg;
    }
    if (matcher.presets.includes(arg) && !foundPreset) {
      foundPreset = getPresetSettings(arg);
    }
    if(!isNaN(arg)) {
      foundBrightness = arg;
    }
  });
  if (!foundRoom.rgb) {
    foundColour = null;
  }
  return { foundRoom, foundColour, foundState, foundBrightness, foundPreset };
}

function getCorrectEndPoint(state, colour, brightness, preset) {
  let url = hassIoEndpoints.LIGHT_ON;
  if (state) {
    switch (state) {
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
    if (!colour && !preset) {
      url = hassIoEndpoints.LIGHT_TOGGLE;
    }
    if (brightness || preset) {
      url = hassIoEndpoints.LIGHT_ON;
    }
  }
  return { url, colour };
}

function getPresetSettings(preset) { 
  let presetList = {
    cozy: { brightness_pct: 60, rgb_color: [ 126, 87, 246 ] },
    bright: { brightness_pct: 95, rgb_color: [ 255, 255, 255 ] },
    warm: { brightness_pct: 75, rgb_color: [ 224, 133, 13 ] },
    fridge: { brightness_pct: 75, rgb_color: [ 237, 14, 14 ] },
  }

  return presetList[preset];
}
