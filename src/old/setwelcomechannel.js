const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    PermissionFlagsBits
} = require('discord.js');

var db = require('../../js/db.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcomechannel')
        .setDescription('Setup a channel for a welcoming (an image and a message) feature! To REMOVE, use the remove option.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Channel where welcome images and messages will be sent')
            .setRequired(false))
        .addBooleanOption(option =>
            option.setName('remove')
            .setDescription('Select true to remove the welcoming feature from the server.')
            .setRequired(false)),

    async execute(interaction) {
        let isRemoving = interaction.options.getBoolean('remove');
        let channel = interaction.options.getChannel('channel');

        if ((channel == null || channel == undefined) && (isRemoving == null || isRemoving == undefined)) {
            interaction.reply('Please enter valid options.')
            return;
        }

        if (isRemoving == true) {
            db.setKey(`server.${interaction.guild.id}.welcomeChannel`, "");
            interaction.reply('Successfully removed welcoming feature from this server!')
            return;
        } else {
            db.setKey(`server.${interaction.guild.id}.welcomeChannel`, channel.id).then(() => {
                interaction.reply(`Welcome messages will now be at ${channel}!`)
            })
        }
    }
};