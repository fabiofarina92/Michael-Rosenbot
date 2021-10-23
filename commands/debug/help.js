module.exports = {
  name: "help",
  description: "Lists all the commands",
  enabled: true,
  execute(config, message, args) {
    let commandString = "";
    config.commands.forEach((command) => {
      if (args[0] && args[0] === command.name) {
        commandString = commandPrinter(command);
      } else {
        if (command.enabled) {
          commandString = commandString.concat(commandPrinter(command));
        }
      }
      if (commandString.length > 1000) {
        message.channel.send(commandString);
        commandString = '';
      }
    });

    message.channel.send(commandString);
  },
};

function commandPrinter(command) {
  let commandString = "";
  if (command.enabled) {
    commandString = commandString.concat(`**Command:** ${command.name}\n`);
    commandString = commandString.concat(`**Description:** ${command.description}\n`);
    if (command.usage) {
      commandString = commandString.concat(`**Usage:** \`${command.usage}\`\n`);
    }
    commandString = commandString.concat("\n");
  }
  return commandString;
}
