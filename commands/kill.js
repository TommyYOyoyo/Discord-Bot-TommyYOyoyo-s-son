const {
    SlashCommandBuilder
} = require('@discordjs/builders');

var db = require('../js/db.js');
var utils = require('../js/utils.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kill')
        .setDescription("Killing people (there's risks of failing!)")
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Enter the target you want to kill!')
            .setRequired(false)),
            
    async execute(interaction, curSec, cooldown) {
        let target = interaction.options.getUser('target')
        if (target == undefined){
            target = interaction.user
        }
        utils.checkAlive(interaction.user.id).then(alive => {
            if (alive == true) {
                if (curSec >= cooldown) {
                    db.setKey(`user.${interaction.user.id}.killCooldown`, `${curSec + 30}`).then(() => {
                        utils.checkAlive(target.id).then(alive => {
                            if (alive == true) {
                                if (target == interaction.user) {
                                    interaction.reply(`${interaction.user} suicided.`);
                                    db.setKey(`user.${interaction.user.id}.alive`, '0')
                                    return;
                                } else {
                                    let randnum = Math.floor(Math.random() * 100)
                                    if (randnum > 50 && randnum <= 100) {
                                        interaction.reply(`${interaction.user} blew off the head of ${target} with a shotgun, oof `)
                                        db.setKey(`user.${target.id}.alive`, '0')
                                    } else if (randnum > 20 && randnum <= 50) {
                                        interaction.reply(`${target} walked away before ${interaction.user} could kill them `)
                                    } else {
                                        interaction.reply(`${interaction.user} accidently put a carrot in their shotgun and killed themselves. `)
                                        db.setKey(`user.${interaction.user.id}.alive`, '0')
                                    }
                                    return;
                                }
                            } else {
                                interaction.reply('The user is already dead bruh.')
                            }
                        })
                    })
                } else {
                    interaction.reply(`Hey, overkilling is not good! You still need to wait **${Math.floor(cooldown-curSec)}** seconds before you could kill again!`)
                }
            } else {
                interaction.reply("Hey, you are dead, how are you supposed to kill if you are dead?")
            }
        })
    }
};