const {
    SlashCommandBuilder
} = require('@discordjs/builders');

var db = require('../js/db.js');
var utils = require('../js/utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resurrect')
        .setDescription("Resurrecting dead people from the death!")
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Enter the target you want to save!')
            .setRequired(false)),
            
    async execute(interaction, curSec, cooldown) {
        let target = interaction.options.getUser('target')
        if (target == undefined){
            target = interaction.user
        }
        if (curSec >= cooldown) {
            db.setKey(`user.${interaction.user.id}.resurrectCooldown`, `${curSec + 30}`).then(() => {
                utils.checkAlive(target.id).then(alive => {
                    if (alive == false) {
                        let randnum = Math.floor(Math.random() * 100)
                        if (randnum > 30 && randnum <= 100) {
                            interaction.reply(`${target} was brought back to the world by an angel :innocent: `)
                            db.setKey(`user.${target.id}.alive`, '1');
                        } else if (randnum > 20 && randnum < 30) {
                            interaction.reply(`${target} was not resurrected because no angels are working rn. :joy: `)
                        } else {
                            interaction.reply(`${target} landed back to the world in a volcano and burned alive :crying_cat_face: `)
                        }
                        return;
                    } else {
                        interaction.reply('The user is still alive man')
                    }
                })
            })
        } else {
            interaction.reply(`Hey, slow down! You still need to wait **${Math.floor(cooldown - curSec)}** seconds before you can resurrect again.`)
        }

    }
};