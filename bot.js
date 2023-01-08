// main js

// TO DO:
//       welcome message,
//       sharding,
//       help command interaction cooldown reset 15secs,
//       yeet command,
//       profile,
//       currency,
//       invites tracker
// delete useless databases



var commands = require('./js/commands.js');
var replies = require('./js/replies.js');
var db = require('./js/db.js');
var utils = require('./js/utils.js');
var replbot = require('./js/replyBot.js');
var WelcomeGen = require('./js/welcomeImage.js');
var listCmds = require('./js/listCmds');

// Require the necessary discord.js classes

const {
    REST
} = require('@discordjs/rest');
require('dotenv').config();
const fs = require('fs')

// DISCORD.JS REQUIRES HERE >>>>>>>>>>>>>>>>>>>>>>>>>
const {
    Client,
    PermissionsBitField,
    GatewayIntentBits,
    Partials,
    ActivityType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageComponentInteraction,
    AttachmentBuilder,
    SlashCommandBuilder,
    Routes,
    CommandInteractionOptionResolver
} = require('discord.js');

// BOT CLIENT HERE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
const client = new Client({
    intents: [GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildInvites,
    ],
    partials: [Partials.Channel]
});

// slash commands registration

const slashCmds = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const slashCmd = require(`./commands/${file}`);
    slashCmds.push(slashCmd.data.toJSON());
    console.log(`[Slash Commands Reg] Successfully registered ${slashCmd}`)
}

const prefix = 'tys';

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

var http = require('http');

http.createServer(function (req, res) {
    res.write("[STATUS] Online");
    res.end();
}).listen(8085);

// When the client is ready, run this code (only once)
client.on('ready', () => {
    console.log('[Ready] Ready!!!!');
    const rest = new REST({
        version: '10'
    }).setToken(process.env.BOT_TOKEN);
    (async () => {
        try {
            console.log(`[Slash Commands] Started refreshing ${slashCmds.length} application (/) commands.`);

            let data = await rest.put(
                Routes.applicationCommands(client.user.id), {
                    body: slashCmds
                },
            );

            console.log(`[Slash Commands] Successfully reloaded ${data.length} application (/) commands.`);

        } catch (error) {
            console.error(error);
        }
    })();
    setInterval(() => client.user.setPresence({
        activities: [{
            name: `tys | Slash commands`,
            type: ActivityType.Playing
        }],
        status: 'online',
    }), 5000);
});


//Rate limit alert
client.rest.on('rateLimited', (info) => {
    console.log(`[RATE]Rate limited!!!!!!!!!!!!! \n ${info}`)
    return;
})

// SLASH COMMANDS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

client.on('interactionCreate', async interaction => {

    db.getKey(`user.${interaction.user.id}`).then(value => {

        if (value != `${interaction.user.username}`) {

            db.setKey(`user.${interaction.user.id}`, `${interaction.user.username}`).then(async () => {
                console.log("[SIGNIN] NEW USER");
                await db.setKey(`user.${interaction.user.id}.alive`, '1');
                await db.setKey(`user.${interaction.user.id}.resurrectCooldown`, '0');
                await db.setKey(`user.${interaction.user.id}.killCooldown`, '0');
                await db.setKey(`user.${interaction.user.id}.nukeCooldown`, '0');
            });
        }
    });

    if (!interaction.isChatInputCommand()) return;
    try {
        let curTime = new Date();
        let curSec = curTime.getTime() / 1000;
        switch (true) {
            case interaction.commandName === 'help':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction, client, listCmds)
                    }
                }
                break;

            case interaction.commandName === 'info':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction, client)
                    }
                }
                break;

            case interaction.commandName === 'kill':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        db.getKey(`user.${interaction.user.id}.killCooldown`).then(cooldown => {
                            if (cooldown == undefined) {
                                db.setKey(`user.${interaction.user.id}.killCooldown`, `0`)
                            } else {
                                thisSlash.execute(interaction, curSec, cooldown)
                            }
                        })
                    }
                }
                break;

            case interaction.commandName === 'resurrect':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        db.getKey(`user.${interaction.user.id}.resurrectCooldown`).then(cooldown => {
                            if (cooldown == undefined) {
                                db.setKey(`user.${interaction.user.id}.resurrectCooldown`, `0`)
                            } else {
                                thisSlash.execute(interaction, curSec, cooldown)
                            }
                        })
                    }
                }
                break;

            case interaction.commandName === 'nuke':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        db.getKey(`user.${interaction.user.id}.nukeCooldown`).then(cooldown => {
                            if (cooldown == undefined) {
                                db.setKey(`user.${interaction.user.id}.nukeCooldown`, `0`)
                            } else {
                                thisSlash.execute(interaction, curSec, cooldown)
                            }
                        })
                    }
                }
                break;

            case interaction.commandName === 'yeet':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction)
                    }
                }
                break;

            case interaction.commandName === 'setrr':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction)
                    }
                }
                break;

            case interaction.commandName === 'setreplybot':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction)
                    }
                }
                break;

            case interaction.commandName === 'setwelcomechannel':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction)
                    }
                }
                break;

            case interaction.commandName === 'setwelcomeimg':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction)
                    }
                }
                break;

            case interaction.commandName === 'setwelcomemessage':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction);
                    }
                }
                break;

            case interaction.commandName === 'setbyemessage':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction);
                    }
                }
                break;

            case interaction.commandName === 'setbyechannel':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction);
                    }
                }
                break;

            case interaction.commandName === 'invites':
                for (const file of commandFiles) {
                    if (file == `${interaction.commandName}.js`) {
                        let thisSlash = require(`./commands/${file}`);
                        thisSlash.execute(interaction);
                    }
                }
                break;
        }

    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }

});

//invites tracker

client.on("guildMemberAdd", async member => {
    db.getKey(`server.${member.guild.id}.welcomeChannel`).then(channel => {
        if (channel != "") {
            db.getKey(`server.${member.guild.id}.welcomeImg`).then(async img => {
                if (img == undefined || img == null) {
                    db.setKey(`server.${member.guild.id}.welcomeImg`, "https://images.wallpapersden.com/image/download/macos-11-big-sur_bGZsbmmUmZqaraWkpJRnamtlrWZpaWVnZWdla2Zr.jpg")
                } else if (img == "") {
                    db.getKey(`server.${member.guild.id}.welcomeMessage`).then(msg => {
                        if (msg == undefined || msg == "") {
                            return;
                        }
                        if (msg.indexOf("USER") > -1) {
                            msg = msg.replace("USER", `<@${member.user.id}>`)
                        }
                        if (msg.indexOf("SERVER") > -1) {
                            msg = msg.replace("SERVER", `${member.guild.name}`)
                        }
                        member.guild.channels.cache.get(channel).send({
                            content: msg,
                        })
                    })
                    return;
                }
                let BufImg = await WelcomeGen.genWelcomeImg(member, img)
                const attachment = new AttachmentBuilder(BufImg, {
                    name: 'welcome.png'
                });
                db.getKey(`server.${member.guild.id}.welcomeMessage`).then(msg => {
                    if (msg == undefined || msg == "") {
                        member.guild.channels.cache.get(channel).send({
                            files: [attachment]
                        })
                        return;
                    }
                    if (msg.indexOf("USER") > -1) {
                        msg = msg.replace("USER", `<@${member.user.id}>`)
                    }
                    if (msg.indexOf("SERVER") > -1) {
                        msg = msg.replace("SERVER", `${member.guild.name}`)
                    }
                    member.guild.channels.cache.get(channel).send({
                        content: msg,
                        files: [attachment]
                    })
                })
            })
        } else {
            return;
        }
    })
})

//member leave tracker
client.on('guildMemberRemove', async member => {
    db.getKey(`server.${member.guild.id}.byeChannel`).then(channel => {
        if (channel != "") {
            db.getKey(`server.${member.guild.id}.byeMessage`).then(msg => {
                if (msg == undefined || msg == "") {
                    member.guild.channels.cache.get(channel).send({content: `**${member.user.username}#${member.user.discriminator}** just left the server.`})
                    return;
                }
                if (msg.indexOf("USER") > -1) {
                    msg = msg.replace("USER", member.user.username.toString() + "#" + member.user.discriminator.toString())
                }
                if (msg.indexOf("SERVER") > -1) {
                    msg = msg.replace("SERVER", `${member.guild.name}`)
                }
                if (msg.indexOf("TOTALMEMBERS") > -1) {
                    msg = msg.replace("TOTALMEMBERS", `${member.guild.memberCount}`)
                }
                member.guild.channels.cache.get(channel).send({content: msg});
            })
        } else {
            return;
        }
    })
})

//message commands

client.on("messageCreate", (message) => {
    let botMem = message.guild.me

    // auto message replies
    if (message.channel.permissionsFor(message.client.user).has(PermissionsBitField.Flags.SendMessages)) {
        switch (true) {

            // commands here . . .

            case (message.content.toLowerCase().startsWith(prefix) && !message.author.bot):
                let curTime = new Date();
                let curSec = curTime.getTime() / 1000;
                let originalArg = message.content.slice(prefix.length + 1);
                let arg = message.content.slice(prefix.length + 1).toLowerCase();
                let rrcmd;

                //add new usr to databases

                db.getKey(`user.${message.author.id}`).then(value => {

                    if (value != `${message.author.username}`) {

                        db.setKey(`user.${message.author.id}`, `${message.author.username}`).then(async () => {
                            console.log("[SIGNIN] NEW USER");
                            await db.setKey(`user.${message.author.id}.alive`, '1');
                            await db.setKey(`user.${message.author.id}.resurrectCooldown`, '0');
                            await db.setKey(`user.${message.author.id}.killCooldown`, '0');
                            await db.setKey(`user.${message.author.id}.nukeCooldown`, '0');
                        });
                    }
                });

                //end here

                db.getKey(`server.${message.guild.id}`).then(value => {

                    if (value != `${message.guild.name}`) {

                        db.setKey(`server.${message.guild.id}`, `${message.guild.name}`).then(() => {
                            console.log('[GUILDS] Registered to a new guild(Discord Server).')
                        });
                    }
                });

                db.getKey(`user.${message.author.id}.RRcmd`).then(value => {
                    rrcmd = value;

                    switch (true) {
                        case arg == 'help':
                            commands.help(message, client).catch(err => console.error())
                            break;

                        case arg.startsWith("resurrect"):
                            db.getKey(`user.${message.author.id}.resurrectCooldown`).then(cooldown => {
                                if (cooldown == undefined) {
                                    db.setKey(`user.${message.author.id}.resurrectCooldown`, `0`)
                                } else {
                                    commands.resurrect({
                                        arg: arg,
                                        message: message,
                                        curSec: curSec,
                                        cooldown: cooldown
                                    })
                                }
                            })
                            break;

                        case arg.startsWith("kill"):
                            db.getKey(`user.${message.author.id}.killCooldown`).then(cooldown => { //
                                if (cooldown == undefined) { //
                                    db.setKey(`user.${message.author.id}.killCooldown`, `0`) //
                                } else { //
                                    commands.kill({
                                        arg: arg,
                                        message: message,
                                        curSec: curSec,
                                        cooldown: cooldown
                                    })
                                }
                            })
                            break;

                        case arg.startsWith("chatbot"):
                            let setchannel = arg.slice("setchannel".length + 1, message.content.indexOf(">") - 3);
                            break;

                        case arg.startsWith("nuke"):
                            db.getKey(`user.${message.author.id}.nukeCooldown`).then(cooldown => {
                                if (cooldown == undefined || cooldown == NaN || cooldown == null) {
                                    db.setKey(`user.${message.author.id}.nukeCooldown`, `0`)
                                } else {
                                    if (message.channel.permissionsFor(message.client.user).has(PermissionsBitField.Flags.EmbedLinks)) {
                                        commands.nuke({
                                            arg: arg,
                                            message: message,
                                            originalArg: originalArg,
                                            curSec: curSec,
                                            cooldown: cooldown
                                        });
                                    } else {}
                                }
                            })
                            break;

                        case arg.startsWith('setrr'):
                            commands.setRR(message, arg);
                            break;

                        case (arg.startsWith('setreplybot')):
                            commands.setReplybot(PermissionsBitField, message, arg);
                            break;

                        case (arg.startsWith('setwelcomechannel')):
                            commands.setWelcome(PermissionsBitField, message, arg);
                            break;

                        case (arg.startsWith('setwelcomeimg')):
                            commands.setWelcomeImg(PermissionsBitField, message, originalArg);
                            break;

                        case (arg.startsWith('setwelcomemessage')):
                            commands.setWelcomeMessage(PermissionsBitField, message, originalArg);
                            break;

                        case (arg.startsWith('setbyemessage')):
                            commands.setByeMessage(PermissionsBitField, message, originalArg);
                            break;

                        case (arg.startsWith('setbyechannel')):
                            commands.setByeChannel(PermissionsBitField, message, originalArg);
                            break;

                        case (arg.startsWith('yeet')):
                            commands.yeet(message, arg);
                            break;

                        case (arg.startsWith('info')):
                            commands.info(message, client);
                            break;

                        case (arg.startsWith(rrcmd)):
                            commands.replyRR(message, arg);
                            break;

                        case (arg.startsWith('invites')):
                            commands.invites(message, arg);
                            break;
                    }
                })
            case (!message.author.bot):
                replbot.replyBot(message);
                break;
        }
    } else {
        return;
    }
})

// just a part for my own server moderating

client.on("messageCreate", (message) => {
    if (message.channelId == process.env.DANK_TRENDING_AC) {
        if (message.webhookId) {
            if (message.embeds[0]) { //if there is embed messages here
                message.reply("<@&958883453707907173>")
            }
        } else {
            return;
        }
    }
})