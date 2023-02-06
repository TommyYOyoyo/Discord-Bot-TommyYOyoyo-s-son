// All commands : * DEPRECATED CODE !

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Collection,
} = require('discord.js');
const {
    EmbedBuilder
} = require('@discordjs/builders');
const isImageURL = require('image-url-validator').default;
require('dotenv').config()
const db = require('./db.js');
const utils = require('./utils.js');
const invitetracker = require('./inviteTracker.js');

var nukeGifLinks = ["https://c.tenor.com/giN2CZ60D70AAAAC/explosion-mushroom-cloud.gif",
    "https://c.tenor.com/YE_vkc5cRxUAAAAM/kaboom-boom.gif",
    "https://c.tenor.com/h4n4Y_HfjhMAAAAM/haha-bongo-cat.gif",
    "https://c.tenor.com/EkW1bQdRl2MAAAAC/explodinghehemwhaha.gif",
    "https://media.discordapp.net/attachments/860285099832639491/998418051890425977/unknown.gif",
    "https://media.discordapp.net/attachments/860285099832639491/998418069095448616/unknown.gif"
]

var yeetGifLinks = [
    "https://c.tenor.com/gISSJc70lH4AAAAC/yeet-naruto.gif",
    "https://c.tenor.com/jSx1KiL3L2UAAAAM/yeet-lion-king.gif",
    "https://c.tenor.com/utik-Y5Yx1MAAAAM/yeet-no.gif",
    "https://c.tenor.com/hp5oHnEqBoYAAAAM/kicking-out.gif",
    "https://c.tenor.com/hALMQJChDzAAAAAC/yeet-stickfigure.gif",
    "https://c.tenor.com/fDZZDOYVZb8AAAAM/frozen-olaf.gif",
    "https://c.tenor.com/yhz79wkknsYAAAAM/yeet-cat.gif",
    "https://c.tenor.com/tCPGyy8fUiUAAAAM/punt-kick.gif",
    "https://c.tenor.com/CRyixbGDSPkAAAAM/minecraft-yeet-yeet.gif"
]

module.exports = {
    redirectToSlash: function (message) {
        message.reply('This command is only available in slash commands, sorry for the inconvenience! To use a slash command, please type "/" and choose the desired command from the list given.');
        return;
    },
    help: async function (message) {
        this.redirectToSlash(message);
    },
    kill: function ({
        arg,
        message,
        curSec,
        cooldown
    }) {
        utils.checkAlive(message.author.id).then(alive => {
            if (alive == true) {
                if (arg.indexOf(">") == -1 && arg.slice("kill".length + 1) != "") {
                    message.reply("The user you wanted to kill is not a valid user. Please use the format: 'tys kill TARGET'.")
                    return;
                } else {
                    if (curSec >= cooldown) {
                        db.setKey(`user.${message.author.id}.killCooldown`, `${curSec + 30}`).then(() => {
                            let target = arg.slice("kill".length + 1, message.content.indexOf(">") - 3)
                            if (target == "") {
                                target = `${message.author.id}`
                            }
                            target = target.replace("<@", "").replace(">", "")
                            utils.checkAlive(target).then(alive => {
                                target = `<@${target}>`
                                if (alive == true) {
                                    if (target == `<@${message.author.id}>`) {
                                        target = `${message.author}`
                                        message.reply(`${message.author} suicided.`);
                                        db.setKey(`user.${message.author.id}.alive`, '0')
                                        return;
                                    } else {
                                        let randnum = Math.floor(Math.random() * 100)
                                        if (randnum > 50 && randnum <= 100) {
                                            message.reply(`${message.author} blow off the head of ${target} with a shotgun, oof `)
                                            target = target.replace("<@", "").replace(">", "")
                                            db.setKey(`user.${target}.alive`, '0')
                                        } else if (randnum > 20 && randnum <= 50) {
                                            message.reply(`${target} walked away before ${message.author} could kill them `)
                                        } else {
                                            message.reply(`${message.author} accidently put a carrot in their shotgun and killed themselves. `)
                                            db.setKey(`user.${message.author.id}.alive`, '0')
                                        }
                                        return;
                                    }
                                } else {
                                    message.reply('The user is already dead bruh.')
                                }
                            })
                        })
                    } else {
                        message.reply(`Hey, overkilling is not good! You still need to wait **${Math.floor(cooldown-curSec)}** seconds before you could kill again!`)
                    }
                }
            } else {
                message.reply("Hey, you are dead, how are you supposed to kill if you are dead?")
            }
        })
    },

    resurrect: function ({
        arg,
        message,
        curSec,
        cooldown
    }) {
        if (arg.indexOf(">") == -1 && arg.slice("resurrect".length + 1) != "") {
            message.reply("The user you wanted to resurrect is not a valid user. Please use the format: 'tys resurrect TARGET'.")
            return;
        } else {
            if (curSec >= cooldown) {
                db.setKey(`user.${message.author.id}.resurrectCooldown`, `${curSec + 30}`).then(() => {
                    let target = arg.slice("resurrect".length + 1, message.content.indexOf(">") - 3)
                    if (target == "") {
                        target = `${message.author.id}`
                    }
                    target = target.replace("<@", "").replace(">", "")
                    utils.checkAlive(target).then(alive => {
                        if (alive == false) {
                            let randnum = Math.floor(Math.random() * 100)
                            if (randnum > 30 && randnum <= 100) {
                                message.reply(`<@${target}> was brought back to the world by an angel :innocent: `)
                                target = target.replace("<@", "").replace(">", "")
                                db.setKey(`user.${target}.alive`, '1');
                            } else if (randnum > 20 && randnum < 30) {
                                message.reply(`<@${target}> was not resurrected because no angels are working rn. :joy: `)
                            } else {
                                message.reply(`<@${target}> landed back to the world in a volcano and burned alive :crying_cat_face: `)
                            }
                            return;
                        } else {
                            message.reply('The user is still alive man')
                        }
                    })
                })
            } else {
                message.reply(`Hey, slow down! You still need to wait **${Math.floor(cooldown - curSec)}** seconds before you can resurrect again.`)
            }
        }
    },
    nuke: function (message) {
        this.redirectToSlash(message);
    },
    setReplybot: function (PermissionsBitField, message, arg) {
        if (message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            let channel = arg.slice("setreplybot".length + 1, message.content.indexOf(">") - 3)
            db.setKey(`server.${message.guild.id}.replybot`, channel.replace("<#", "").replace(">", "")).then(() => {
                message.reply('Set successfully!')
            })
        } else {
            message.reply('Sorry, it seems that you are missing the **Manage Channels** permissions. You need to have this permission to setup the reply bot channel :(')
        }
    },
    //secret rickroll
    setRR: function (message, arg) {
        db.setKey(`user.${message.author.id}.RRcmd`, (arg.slice("setrr".length + 1))).then(() => {
            message.reply('RRkey successfully set!')
        })
    },
    replyRR: function (message, arg) {
        setTimeout(() => {
            message.channel.send('Proceeding').then((rmsg) => {
                setTimeout(() => {
                    rmsg.edit('Proceeding.')
                }, 100);
                setTimeout(() => {
                    rmsg.edit('Proceeding..')
                }, 200);
                setTimeout(() => {
                    rmsg.edit('Proceeding...')
                }, 300);
                setTimeout(() => {
                    rmsg.edit('https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713')
                }, 400)
            })
        }, 50);
    },
    //end
    setWelcome: function (PermissionsBitField, message, arg) {
        if (message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            let channel = arg.slice("setwelcomechannel".length + 1, message.content.indexOf(">") - 3)
            if (!channel.startsWith('<#') && channel.length != 21) {
                message.reply("Welcome images will now be disabled in your server. (You've set an invalid channel)");
                db.setKey(`server.${message.guild.id}.welcomeChannel`, "");
                return;
            }
            db.setKey(`server.${message.guild.id}.welcomeChannel`, channel.replace("<#", "").replace(">", "")).then(() => {
                message.reply(`Welcome messages will now be at ${channel}!`)
            })
        } else {
            message.reply("Seems that you are missing the MANAGE CHANNEL permission to set the welcome message channel ;(");
        }
    },
    setWelcomeImg: function (PermissionsBitField, message, oriArg) {
        if (message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            let imgSrc = oriArg.slice("setwelcomeimg".length + 1, oriArg.indexOf("font") - 1);
            let fontColor = oriArg.slice(oriArg.indexOf("font color:") + 12);
            isImageURL(imgSrc).then(is_image => {
                if (is_image == true) {
                    db.setKey(`server.${message.guild.id}.welcomeImg`, imgSrc.toString());
                    if (fontColor != '' || fontColor != undefined || fontColor != null) {
                        if (!fontColor.startsWith('#') || !fontColor.length == 7){
                            message.reply("Your font color is not a HEX CODE.")
                            return;
                        }
                        db.setKey(`server.${message.guild.id}.welcomeImg.fontColor`, fontColor.toString());
                        message.reply("Image and font color set successfully!");
                        return;
                    }
                    message.reply("Image set successfully!");
                    return;
                } else {
                    message.reply('Sorry, your link may have some problems :( This bot only supports links ending with jpg, jpeg and png formats.')
                }
            })
        } else {
            message.reply("Seems that you are missing the MANAGE CHANNEL permission to set the welcome image ;(");
        }
    },
    setWelcomeMessage: function (PermissionsBitField, message, oriArg) {
        if (message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            let msg = oriArg.slice("setwelcomemessage".length + 1)
            db.setKey(`server.${message.guild.id}.welcomeMessage`, msg);
            message.reply(`Welcome message will now be "${msg}"!`);
            return;
        } else {
            message.reply("Seems that you are missing the MANAGE CHANNEL permission to set the welcome message content ;(");
        }
    },
    setByeMessage: function (PermissionsBitField, message, oriArg) {
        if (message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            let msg = oriArg.slice("setbyemessage".length + 1)
            db.setKey(`server.${message.guild.id}.byeMessage`, msg);
            message.reply(`I will now send "${msg}" each time a member leaves!`);
            return;
        } else {
            message.reply("Seems that you are missing the MANAGE CHANNEL permission to set the bye message content ;(");
        }
    },
    setByeChannel: function (PermissionsBitField, message, oriArg){
        if (message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            let channel = oriArg.slice("setbyechannel".length + 1)
            db.setKey(`server.${message.guild.id}.byeChannel`, channel);
            message.reply(`I will now send goodbye messages to ${channel} each time a member leaves this server!`);
            return;
        } else {
            message.reply("Seems that you are missing the MANAGE CHANNEL permission to set the welcome message channel ;(");
        }
    },
    yeet: function (message, arg) {
        let target = arg.slice("yeet".length + 1, message.content.indexOf(">") - 3)
        if (target.startsWith("<@")) {
            let msg = new EmbedBuilder()
                .setTitle(`YEET!!!!!!!!!!`)
                .setColor([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)])
                .setDescription(`POV ${message.author} yeeting ${target} to a galaxy far far far far away, maybe even out of the universe...Who knows?`)
                .setImage(yeetGifLinks[Math.floor(Math.random() * yeetGifLinks.length)])
            message.reply({
                embeds: [msg]
            })
        } else {
            message.reply("Bro, who are you yeeting lol, I can't find your target :joy:")
        }
    },
    info: function (message, client) {
        let creationDate = client.user.createdAt;
        let guildCounts = client.guilds.cache.size;
        let sourceCode = 'https://github.com/TommyYOyoyo/TommyYOyoyo-s-son-Bot';
        let uptimeSeconds = ((client.uptime) / 1000);
        console.log(`[DEBUG] UptimeSeconds = ${uptimeSeconds}, uptime = ${client.uptime}`);
        let uptimeHours = (uptimeSeconds / 3600).toFixed(2);
        console.log(`[DEBUG] UptimeHours = ${uptimeHours}`);

        let msg = new EmbedBuilder()
            .setTitle(`Informations about ${client.user.username}`)
            .setColor([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)])
            .setAuthor({
                name: "TommyYOyoyo's son",
                iconURL: 'https://i.postimg.cc/rwXj33rv/sonnnn.png'
            })
            .addFields({
                name: 'Creation date',
                value: creationDate.toString(),
                inline: true
            }, {
                name: 'Developer:',
                value: 'TommyYOyoyo#8835',
                inline: true
            }, {
                name: 'Servers count:',
                value: guildCounts.toString(),
                inline: true
            }, {
                name: 'Bot prefix:',
                value: 'Slash command (/)',
                inline: true
            }, {
                name: 'Time since last restart:',
                value: `${uptimeHours.toString()}h`,
                inline: true
            }, {
                name: 'Source code:',
                value: sourceCode,
                inline: true
            }, )
            .setFooter({
                text: 'Type "tys help" to get helps about the commands available!!'
            })
        message.reply({
            embeds: [msg]
        })
    },
    invites: async function (message, arg) {

        let user = arg.slice("invites".length + 1);

        if (user == '') {
            user = message.author;
        } else if (!user.startsWith('<@') || !user.endsWith('>') || user.length != 21) {
            message.reply('This is not a valid user.');
            return;
        }

        let content = await invitetracker.invitesTracker(message, user);

        message.reply(`${content}`);
    }
}
