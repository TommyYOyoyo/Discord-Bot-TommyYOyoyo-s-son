// Source command of the slash command setrickroll

/*
 * The slash command setrickroll will set a specific text command to the user
 * The rickroll is automatically triggered when the command is sent by the user.
 * The text command handling is available in the TYS - Main repl.
 */

const {
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    SlashCommandBuilder,
} = require("@discordjs/builders");

const mongoose = require("mongoose");
const USER = require("../../models/User.js");
const { registerUser } = require("../../database/register-user.js");
const { ActionRowBuilder } = require("discord.js");
const { handleError } = require("../../utils/errorHandling.js");

module.exports = {
    // The following two variables are used for the Help Command
    name: "set-rickroll",
    description: "Set a secret custom text command which will be used to trigger an automatic rickroll! It's trolling time!",

    data: new SlashCommandBuilder()
        .setName("set-rickroll")
        .setDescription("Set a secret custom text command which will be used to trigger an automatic rickroll!")
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("Enter the secret command of rickroll!")
                .setRequired(true)
        ),

    async execute(interaction) {
        const User = mongoose.model("User", USER.userSchema, "Users");

        // Setting up the custom command
        try {
            // Get user's custom command in a string
            const stringCmd = interaction.options.getString("command");
            // Retrieve informations about the user from the database
            const userDocument = await User.findOne({
                userId: interaction.user.id,
            });
            // If user was not found in the DB, register the user to the database
            if (userDocument == null) await registerUser(interaction.user);
            await User.findOneAndUpdate(
                { userId: interaction.user.id },
                { $set: { rickrollCommand: stringCmd } },
                { upsert: true }
            );
        } catch (err) {
            handleError(interaction, err);
        }

        // Creating a drop menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("prefix")
            .setPlaceholder(
                "Select prefix for your secret rickroll command here"
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("tys")
                    .setDescription(
                        "This stands for this bot's name's abbreviation."
                    )
                    .setValue("tys"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("hmmmm")
                    .setDescription("Hmmmm, what a prefix!")
                    .setValue("hmmmm"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Rick says")
                    .setDescription("Rick knows what he's saying.")
                    .setValue("Rick says"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("wanna")
                    .setDescription("Wanna get rkrld?")
                    .setValue("wanna"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("do not")
                    .setDescription("Do not do it. Period.")
                    .setValue("do not")
            );
        const row = new ActionRowBuilder().addComponents(selectMenu);
        // Sending the drop-menu to the command creator
        const response = await interaction.reply({
            content: "Select the prefix of your custom command!",
            components: [row],
        });

        // Collector that collects the choice the user selected from the drop menu
        const collectorFilter = (i) => i.user.id === interaction.user.id;
        try {
            const choice = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60000,
            });
            // Prevent the "interaction has failed" error message from showing up
            await choice.deferUpdate();
            // Prefix setting
            await User.findOneAndUpdate(
                { userId: interaction.user.id },
                { $set: { rickrollPrefix: choice.values[0] } },
                { upsert: true }
            );
            await interaction.followUp({
                content:
                    "**Secret rickroll command successfully set!**\nPlease use the command with the prefix that you have chosen. e.g: tys get rickrolled.",
                ephemeral: true
            });
        } catch (err) {
            await interaction.editReply({
                content:
                    "Choice not received within 1 minute, this operation is cancelled.",
                components: [],
            });
        }
    },
};
