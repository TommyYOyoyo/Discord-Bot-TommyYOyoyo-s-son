/*const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    PermissionFlagsBits
} = require('discord.js');

var db = require('../js/db.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setreplybot')
        .setDescription('Set a specific channel for a reply bot! To REMOVE one, use the remove option.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Channel of the reply bot')
            .setRequired(false))
        .addBooleanOption(option =>
            option.setName('remove')
            .setDescription('Select true to remove the reply bot.')
            .setRequired(false)),

    async execute(interaction) {
        let channel = interaction.options.getChannel('channel')
        let isRemoving = interaction.options.getBoolean('remove')
        
        if ((channel == null || channel == undefined) && (isRemoving == null || isRemoving == undefined)) {
            interaction.reply('Please enter valid options.')
            return;
        }

        if (isRemoving == true) {
            interaction.reply("Reply bot will now be disabled in your server!");
            db.setKey(`server.${interaction.guild.id}.replybot`, "");
            return;
        }
        db.setKey(`server.${interaction.guild.id}.replybot`, channel.id).then(() => {
            interaction.reply(`Reply bot will now be at ${channel}!`)
        })
    }
};*/