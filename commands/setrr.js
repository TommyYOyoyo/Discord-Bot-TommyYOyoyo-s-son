const { SlashCommandBuilder } = require('@discordjs/builders');

var db = require('../js/db.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrr')
        .setDescription('Set a custom command to secretly rickroll people!')
        .addStringOption(option => 
            option.setName('command')
                .setDescription('Enter the secret command of rickroll!')
                .setRequired(true)),

    async execute(interaction) {
        let stringCmd = interaction.options.getString('command');
        db.setKey(`user.${interaction.user.id}.RRcmd`, (stringCmd)).then(() => {
            interaction.reply('RR command successfully set! Please use the command with the prefix "tys"! (E.g. tys sike)')
        })
    }
};
