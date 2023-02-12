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
        .setDescription("Drop a nuke to a place, a person or a group of people!")
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
        // get place
        let place = interaction.options.getString('place');
        let duplicatedTargets = [];
        // get all users and append each of them in the array
        for (let i = 0; i <= 8; i++) if (interaction.options.getUser(`target${i}`) != undefined) duplicatedTargets.push(interaction.options.getUser(`target${i}`));
        // remove duplicates
        let targets = Array.from(new Set(duplicatedTargets));
        // detect if there is no value entered
        if (targets.length == 0 && place == null) place = `${interaction.user}'s house`;

        // check if user is alive
        utils.checkAlive(interaction.user.id).then(alive => {
            // if user is alive
            if (alive == true) {
                // if cooldown is over
                if (curSec >= cooldown) {
                    // restart cooldown
                    db.setKey(`user.${interaction.user.id}.nukeCooldown`, `${curSec + 60}`).then(() => {

                        let randnum = Math.floor(Math.random() * 100); // random probability 
                        let gif; 
                        let reply; // replying message
                        let specifiedTgt; // all the targets in one string 

                        // setting up the specifiedTgt
                        if(targets.length != 0){
                            // creating a string that contains all victim targets
                            victims = "";
                            switch (targets.length){
                                case 1:
                                    victims += `${targets[0]}`; break;
                                case 2:
                                    victims += `${targets[0]} and ${targets[1]}`; break;
                                case 3:
                                    victims += `${targets[0]}, ${targets[1]} and ${targets[2]}`; break;
                                // >= 4 ppl
                                default:
                                    // until 3 elements before the end
                                    for (let i = 0; i < targets.length - 3; i++) {
                                        victims += `${targets[i]}, `;
                                    }
                                    // last 3 elements
                                    victims += `${targets[targets.length-3]}, ${targets[targets.length-2]} and ${targets[targets.length-1]}`;
                                    break;
                            }

                            if (place != null){
                                specifiedTgt = `${place} and also to `
                                specifiedTgt += victims;
                            } else {
                                specifiedTgt = victims;
                            }
                        } else {
                            specifiedTgt = place;
                        }

                        // replies for the command
                        if (randnum > 50 && randnum <= 95) {
                            reply = `${interaction.user} dropped a nuke to ${specifiedTgt}, TOTAL DESTRUCTION! \n\n**POV** the nuclear strike zone:`;
                            gif = `${nukeGifLinks[Math.floor(Math.random() * nukeGifLinks.length)]}`;
                            // eliminate targets
                            if (targets != []) {
                                targets.forEach(el => {
                                    db.setKey(`user.${el.id}.alive`, '0');
                                })
                            }
                        } else if (randnum > 20 && randnum < 30) {
                            reply = `${interaction.user} tried to drop a nuke but the Navy intercepted them. **WHAT A KARMA!**`;
                        } else if (randnum > 30 && randnum <= 49) {
                            reply = (`${interaction.user} dropped the nuke to ${specifiedTgt} but the poorly programmed nuke flew back to their plane. **TO BE CONTINUED...**`);
                            db.setKey(`user.${interaction.user.id}.alive`, '0');
                        } else if (randnum > 95 && randnum <= 100) {
                            reply = (`${interaction.user} dropped the nuke to ${specifiedTgt} but everyone there magically survived! **MAGIK!** \n\nPOV ${place}:`);
                            gif = "https://c.tenor.com/8gpittE_R9oAAAAM/running-dodging.gif";
                        } else {
                            reply = (`Bro stop dreaming about nukes and go get a job man :joy:`);
                        }

                        // embedded message generation
                        let randomColor1 = Math.floor(Math.random() * 255)
                        let randomColor2 = Math.floor(Math.random() * 255)
                        let randomColor3 = Math.floor(Math.random() * 255)
                        let nukeMsg = new EmbedBuilder()
                            .setColor([randomColor1, randomColor2, randomColor3])
                            .setTitle(`${interaction.user.username}'s nuking process...`)
                            .setDescription(`${reply}`)
                            .setImage(gif)

                        // message reply
                        interaction.reply({
                            embeds: [nukeMsg]
                        })

                    })
                // cooldown is not over
                } else {
                    interaction.reply(`Yo slow down, your factory is still manufacturing the nuke lol. You still need to wait **${Math.floor(cooldown-curSec)}** seconds before you could throw another nuke.`)
                }
            // user is dead
            } else {
                interaction.reply("Hey, you are dead. Dead people can't nuke LMAO")
            }
        })
    }
}