const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const fs = require("fs");
const { readdirSync } = require('fs');
const path = require("path");

const serverConfig = { []: {} }

module.exports = {
	// const customCommandAdapter = new FileSync("./data/custom_commands.json");
	// const commandDB = low(customCommandAdapter);
	// commandDB.defaults({ customCommands: [] }).write();

	setupConfig(server) {
		this.loadServerConfig();
		if (!serverConfig[server]) {
			const serverFilePath = path.join(__dirname, "data", server);
			if (!fs.existsSync(serverFilePath)) {
				fs.mkdirSync(serverFilePath);
				fs.writeFileSync(path.join(serverFilePath, "config.json"), "{}");
				fs.writeFileSync(path.join(serverFilePath, "custom.json"), "{}");
			}
		}
	},
	loadServerConfig() {
		const getDirectories = source =>
				readdirSync(source, { withFileTypes: true })
						.filter(directoryEntity => directoryEntity.isDirectory())
						.map(directoryEntity => directoryEntity.name);

		const dataDirectory = path.join(__dirname, "data");
		const allServers = getDirectories(dataDirectory);
		for (const server of allServers) {
			if (!serverConfig[server]) {
				const serverDirectory = path.join(dataDirectory, server);
				serverConfig[server] = { config: require(path.join(serverDirectory, "config.json")), custom: require(path.join(serverDirectory, "custom.json"))};
			}
		}
	},
	getConfig(server, key) {
		if (serverConfig[server] && serverConfig[server].config[key]) {
			return serverConfig[server].config[key];
		} else {
			return null;
		}
	},
	setConfig(server, key, value) {
		if (serverConfig[server] && serverConfig[server].config) {
			serverConfig[server].config[key] = value;
			return true;
		} else {
			return false;
		}
	}
}
