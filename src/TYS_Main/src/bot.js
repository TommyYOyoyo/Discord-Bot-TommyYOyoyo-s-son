// Core functions of the bot are in this file.

const http = require("http");

const {
    Client,
    Events,
    GatewayIntentBits,
    PermissionsBitField,
    ActivityType,
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
const mongoose = require("mongoose");
const server = require("./server.js");
const USER = require("./User.js");
const User = mongoose.model("Users", USER.userSchema, "Users");

// Login into the bot
client.login(process.env.BOT_TOKEN);

// When bot is ready
client.once(Events.ClientReady, (c) => {
    // Keep bot online
    http.createServer(function (req, res) {
        res.write(`${new Date().toString()} [STATUS] Online! \n`);
        res.end();
    }).listen(8080);

    setInterval(
        () =>
            client.user.setPresence({
                activities: [
                    {
                        name: `/help | BETA TYS`,
                        type: ActivityType.Playing,
                    },
                ],
                status: "online",
            }),
        10000
    );

    console.log(`${new Date().toString()} [INIT] Ready!!! \n`);
});

// Launch mongoDB database using mongoose
server.connect().catch((err) => console.error);

client.on("messageCreate", async (message) => {
    // Custom rickroll commands handling
    if (
        message.content.startsWith("tys") ||
        message.content.startsWith("hmmmm") ||
        message.content.startsWith("Rick says") ||
        message.content.startsWith("wanna") ||
        message.content.startsWith("do not")
    ) {
        const userDocument = await User.findOne({ userId: message.author.id });
        const userPrefix = userDocument.rickrollPrefix;
        const userCommand = userDocument.rickrollCommand;
        let messagePrefix;
        // The prefix ends rather at the second apsace in those two conditions
        if (
            message.content.startsWith("Rick says") ||
            message.content.startsWith("do not")
        ) {
            // Find the second space of the message string
            messagePrefix = message.content.slice(
                0,
                message.content.indexOf(" ", message.content.indexOf(" ")+1)
            );
        } else {
            messagePrefix = message.content.slice(
                0,
                message.content.indexOf(" ")
            );
        }
        const messageCommand = message.content.slice(messagePrefix.length + 1);
        // If the prefix and command match
        if (userPrefix == messagePrefix && userCommand == messageCommand)
            message.channel.send(
                "**Never gonna give you up! Never gonna let you down!** \nhttps://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif"
            );
    }

    // A part for my own server's moderation
    if (message.channelId == process.env.DANK_TRENDING_AC) {
        if (message.webhookId) {
            if (message.embeds[0]) {
                //if there is embed messages here
                message.reply("<@&958883453707907173>");
            }
        } else {
            return;
        }
    }
});
