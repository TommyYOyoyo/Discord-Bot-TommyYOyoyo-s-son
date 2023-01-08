const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    PermissionFlagsBits
} = require('discord.js');

var db = require('../js/db.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbyemessage')
        .setDescription('What message should I send when a member quits the server?')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('message')
            .setDescription('USER to ping the member, SERVER to display the server name, TOTALMEMBERS to get total members left.')
            .setRequired(true)),

    async execute(interaction) {
        let msg = interaction.options.getString('message')

        db.setKey(`server.${interaction.guild.id}.byeMessage`, msg.toString());
        interaction.reply(`Goodbye message will now be "${msg}"!`);
        return;
    }
};