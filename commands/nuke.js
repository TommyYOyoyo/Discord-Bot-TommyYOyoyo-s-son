const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('@discordjs/builders');

var db = require('../js/db.js');
var utils = require('../js/utils.js');

var nukeGifLinks = ["https://c.tenor.com/giN2CZ60D70AAAAC/explosion-mushroom-cloud.gif",
    "https://c.tenor.com/YE_vkc5cRxUAAAAM/kaboom-boom.gif",
    "https://c.tenor.com/h4n4Y_HfjhMAAAAM/haha-bongo-cat.gif",
    "https://c.tenor.com/EkW1bQdRl2MAAAAC/explodinghehemwhaha.gif",
    "https://media.discordapp.net/attachments/860285099832639491/998418051890425977/unknown.gif",
    "https://media.discordapp.net/attachments/860285099832639491/998418069095448616/unknown.gif"
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription("Send a nuke to a place, a person or a group of people!")
        .addStringOption(option =>
            option.setName('place')
            .setDescription('Place(s) you want to nuke')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('target1')
            .setDescription('User target to nuke')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('target2')
            .setDescription('User target to nuke')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('target3')
            .setDescription('User target to nuke')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('target4')
            .setDescription('User target to nuke')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('target5')
            .setDescription('User target to nuke')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('target6')
            .setDescription('User target to nuke')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('target7')
            .setDescription('User target to nuke')
            .setRequired(false))
        .addUserOption(option =>
            option.setName('target8')
            .setDescription('User target to nuke')
            .setRequired(false)),

    async execute(interaction, curSec, cooldown) {
        let place = interaction.options.getString('place')

        let targets = [];
        
        for(let i = 0; i < 8; i++){
            let target = interaction.options.getUser(`target${i}`)
            if (target != undefined){
                targets.push(target)
            }
        }

        utils.checkAlive(interaction.user.id).then(alive => {
            if (alive == true) {
                if (curSec >= cooldown) {
                    db.setKey(`user.${interaction.user.id}.nukeCooldown`, `${curSec + 60}`).then(() => {

                        if (place == undefined) {
                            place = `${interaction.user}'s house`
                        }

                        let randnum = Math.floor(Math.random() * 100)
                        let img;

                        let reply;
                        let specifiedTgt;

                        if(targets != []){
                            if (place != undefined){
                                specifiedTgt = `${place}, also to`
                                targets.forEach(item => {
                                    specifiedTgt = specifiedTgt.concat(', ', item)
                                })
                            } else {
                                specifiedTgt = ''
                                targets.forEach(item => {
                                    specifiedTgt = specifiedTgt.concat(', ', item)
                                })
                            }
                        } else if (place != undefined){
                            specifiedTgt = place.toString();
                        }

                        if (randnum > 50 && randnum <= 90) {
                            reply = `${interaction.user} dropped a nuke to ${specifiedTgt}, TOTAL DESTRUCTION! \n\nPOV ${specifiedTgt}:`
                            img = `${nukeGifLinks[Math.floor(Math.random() * nukeGifLinks.length)]}`
                            if (targets != []) {
                                targets.forEach(el => {
                                    db.setKey(`user.${el.id}.alive`, '0')
                                })
                            }
                        } else if (randnum > 20 && randnum < 30) {
                            reply = `${interaction.user} tried to drop a nuke but the Navy intercepted them. **WHAT A KARMA!**`
                        } else if (randnum > 30 && randnum <= 49) {
                            reply = (`${interaction.user} dropped the nuke to ${specifiedTgt} but the malprogrammed nuke flew back to their plane. **TO BE CONTINUED...**`)
                            db.setKey(`user.${interaction.user.id}.alive`, '0')
                        } else if (randnum > 90 && randnum <= 100) {
                            reply = (`${interaction.user} dropped the nuke to ${specifiedTgt} but everyone there magically survived! **MAGIK!** \n\nPOV ${place}:`)
                            img = "https://c.tenor.com/8gpittE_R9oAAAAM/running-dodging.gif"
                        } else {
                            reply = (`Bro stop dreaming nukes and go get a job man :joy:`)
                        }
                        let randomColor1 = Math.floor(Math.random() * 255)
                        let randomColor2 = Math.floor(Math.random() * 255)
                        let randomColor3 = Math.floor(Math.random() * 255)
                        let nukeMsg = new EmbedBuilder()
                            .setColor([randomColor1, randomColor2, randomColor3])
                            .setTitle(`${interaction.user.username}'s nuking process...`)
                            .setDescription(`${reply}`)
                            .setImage(img)

                        interaction.reply({
                            embeds: [nukeMsg]
                        })
                    })
                } else {
                    interaction.reply(`Yo slow down, your factory can only make one nuke per minute loll. You still need to wait **${Math.floor(cooldown-curSec)}** seconds before you could throw another nuke.`)
                }
            } else {
                interaction.reply("Hey, you are dead. Dead people can't nuke LMAO")
            }
        })
    }
}