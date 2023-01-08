const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    PermissionFlagsBits
} = require('discord.js');

var db = require('../js/db.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbyechannel')
        .setDescription('The channel where I will send a message everytime a member leaves the server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The channel where the farewells will be sent.')
            .setRequired(false))
        .addBooleanOption(option =>
            option.setName('remove')
            .setDescription("Select true to disable the farewell logging when a member leaves.")
            .setRequired(false)),

    async execute(interaction) {
        let channel = interaction.options.getChannel('channel')
        let isRemoving = interaction.options.getBoolean('remove')

        if ((channel == null || channel == undefined) && (isRemoving == null || isRemoving == undefined)) {
            interaction.reply('Please enter valid options.')
            return;
        }

        if (isRemoving){
            db.setKey(`server.${interaction.guild.id}.byeChannel`, '');
            interaction.reply('Leaving messages will now be disabled for your server!');
            return;
        }

        db.setKey(`server.${interaction.guild.id}.byeChannel`, channel.id);
        interaction.reply(`Farewells will now be at ${channel}!`);
        return;
    }
};