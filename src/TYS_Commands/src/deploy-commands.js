// Slash commands registration
// Code is directly imported from Discord.JS Guide with slight modifications

const { REST, Routes } = require("discord.js");
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    deployCommands: function () {
        const commands = [];
        // Grab all the command files from the commands directory
        const foldersPath = path.resolve("./src/commands"); // Grabs the absolute path of the folder to prevent EONENT errors.
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            // Grab all the command files from the commands directory
            const commandsPath = `${foldersPath}/${folder}`;
            const commandFiles = fs
                .readdirSync(commandsPath)
                .filter((file) => file.endsWith(".js"));
            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
            for (const file of commandFiles) {
                const filePath = path.resolve(commandsPath, file);
                const command = require(filePath);
                if ("data" in command && "execute" in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(
                        `${new Date().toString()} [WARNING] The command at ${filePath} is missing a required "data" or "execute" property. \n`
                    );
                }
            }
        }

        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(token);

        // and deploy the commands
        (async () => {
            try {
                console.log(
                    `${new Date().toString()} [COMMANDS] Started refreshing ${commands.length} application (/) commands. \n`
                );

                // The put method is used to fully refresh all commands
                const data = await rest.put(
                    Routes.applicationCommands(clientId),
                    { body: commands },
                );

                console.log(
                    `${new Date().toString()} [COMMANDS] Successfully reloaded ${data.length} application (/) commands. \n`
                );
            } catch (error) {
                // Logging errors
                console.error(error);
            }
        })();
    },
};
