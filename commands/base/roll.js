module.exports = {
  name: "roll",
  description: "Executes a command a random number of times between 1 and the specified value",
  enabled: true,
  usage: "roll <number>d<command>",
  example: "roll 5dcatto",
  execute(config, message, args) {
    let vals = args[0].match(/([0-9]*)d(\w*)/);
    let count = vals[1];
    let command = vals[2];
    let newArgs = args.splice(0, 1);

    if (!count || !command) {
      message.reply("Invalid format. Please use `roll <number>d<command>`");
      return;
    }

    if (!isNaN(command)) {
      if (count > 100) {
        message.reply("I'm not rolling that many times. You can fuck right off.");
        return;
      }
      let accumulatorString = "";
      for (let i = 0; i < count; i++) {
        accumulatorString = accumulatorString + "D" + (i + 1) + ": `" + (Math.floor(Math.random() * Number(command)) + 1) + "`\n";
      }
      let replyString = "Your roll of " + count + "d" + command + " returned \n" + accumulatorString;
      message.reply(replyString);
      return;
    }

    if (count > 5) {
      message.reply("Fuck off. That's too many times to repeat something!");
      return;
    }
    let repeat = Math.floor(Math.random() * Number(count)) + 1;

    console.log("repeat", repeat);
    console.log("command", command);
    console.log("newArgs", newArgs);

    if (!config.commands.get(command)) {
      message.reply("That command doesn't exist!");
      return;
    }

    try {
      for (let i = 0; i < repeat; i++) {
        config.commands.get(command).execute(config, message, newArgs);
      }
    } catch (error) {
      console.log(error);
    }
  },
};
