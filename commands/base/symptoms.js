module.exports = {
  name: "symptoms",
  description: "Get a diagnosis",
  usage: "symptoms",
  enabled: true,
  execute(config, message, args) {
    const disease = ["cancer", "tumor", "warts", "hyper-engorging", "spicy", "inflated", "sub-dermal bleeding"];
    const affectedArea = ["genitals", "penis", "ass", "head", "anus"];

    const selecteDisease = disease[Math.floor(Math.random() * disease.length)];
    const selectedArea = affectedArea[Math.floor(Math.random() * affectedArea.length)];

    message.reply(`I diagnose you with ${selecteDisease} of the ${selectedArea}`);
  },
};
