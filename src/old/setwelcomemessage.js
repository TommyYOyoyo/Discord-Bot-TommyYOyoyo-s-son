const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    PermissionFlagsBits
} = require('discord.js');

var db = require('../../js/db.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcomemessage')
        .setDescription('What message should I send when a member joins the server?')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('message')
            .setDescription('Type USER to ping the new member, SERVER to make it display the server name.')
            .setRequired(false))
        .addBooleanOption(option =>
            option.setName('remove')
            .setDescription("Select false to remove the welcome-messaging feature.")
            .setRequired(false)),

    async execute(interaction) {
        let msg = interaction.options.getString('message')
        let isRemoving = interaction.options.getBoolean('remove')

        if ((msg == null || msg == undefined) && (isRemoving == null || isRemoving == undefined)) {
            interaction.reply('Please enter valid options.')
            return;
        }

        if (isRemoving){
            db.setKey(`server.${interaction.guild.id}.welcomeMessage`, '');
            interaction.reply('Welcome messages will now be disabled for your server!');
            return;
        }

        db.setKey(`server.${interaction.guild.id}.welcomeMessage`, msg.toString());
        interaction.reply(`Welcome message will now be "${msg}"!`);
        return;
    }
};