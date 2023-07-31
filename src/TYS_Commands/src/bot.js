// Core functions of the bot and commands handling are in this file.

const server = require("./database/server.js");
const { deployCommands } = require("./deploy-commands.js");
const http = require("http");
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");

const {
    Client,
    Events,
    GatewayIntentBits,
    PermissionsBitField,
    ActivityType,
    Collection,
} = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
    ],
});

// Login into the bot
client.login(process.env.BOT_TOKEN);

// Retrieve and load commands
client.commands = new Collection();

// Grabbing the command folders' path from the project root folder
const foldersPath = path.resolve("./src/commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Retrieve all command files in a sub-folder
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

    // Load all commands in the sub-folder
    for (const file of commandFiles) {
        const filePath = `./commands/${folder}/${file}`;
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `${new Date().toString()} [WARNING] The command at ${filePath} is missing a required "data" or "execute" property. \n`
            );
        }
    }
}

// When bot is ready
client.once(Events.ClientReady, (c) => {
    // Create an HTTP server to keep the bot online
    http.createServer(function (req, res) {
        res.write(`${new Date().toString()} [STATUS] Online! \n`);
        res.end();
    }).listen(8080);

    // deploy slash commands
    deployCommands();

    console.log(`${new Date().toString()} [INIT] Ready!!! \n`);
});

// Launch mongoDB database using mongoose
server.connect().catch((err) => console.error);

// Slash commands handling
client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    // Command not found
    if (!command) {
        console.error(
            `${new Date().toString()} [COMMAND ERR] No command matching ${
                interaction.commandName
            } was found. \n`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        // Notifying the user about the error.
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: `There was an error while executing this command! Please report this issue in this server: https://discord.gg/wRtZ6fRhZC at #bugs-report
            \n Error message: ${error}`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `There was an error while executing this command! Please report this issue in this server: https://discord.gg/wRtZ6fRhZC at #bugs-report
            \n Error message: ${error}`,
                ephemeral: true,
            });
        }
    }
});
