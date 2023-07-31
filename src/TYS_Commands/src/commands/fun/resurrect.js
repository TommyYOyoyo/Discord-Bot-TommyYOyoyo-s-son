// Source code of the slash command Resurrect

const { SlashCommandBuilder } = require("@discordjs/builders");

const mongoose = require("mongoose");
const USER = require("../../models/User.js");
const { registerUser } = require("../../database/register-user.js");
const { handleError } = require("../../utils/errorHandling.js");

module.exports = {
    // The following two variables are used for the Help Command
    name: "resurrect",
    description: "Virtually resurrect a dead user killed by other commands, such as /nuke or /kill.",

    data: new SlashCommandBuilder()
        .setName("resurrect")
        .setDescription("Virtually resurrect a dead user killed by other commands, such as /nuke or /kill.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Enter the target you want to save here")
                .setRequired(false)
        ),

    async execute(interaction) {
        const User = mongoose.model("User", USER.userSchema, "Users");

        try {
            let target = interaction.options.getUser("target");
            if (target == undefined) target = interaction.user;
            // Retrieve datas of the two involved users from the database
            let saverDocument = await User.findOne({
                userId: interaction.user.id,
            });
            let targetDocument = await User.findOne({
                userId: target.id,
            });
            // Detect if user or target is a new user (if they are registered in the db)
            // If not, register them to the database and retrieve the new values
            if (saverDocument == null) {
                await registerUser(interaction.user);
                saverDocument = await User.findOne({
                    userId: interaction.user.id,
                });
            }
            if (targetDocument == null) {
                await registerUser(target);
                targetDocument = await User.findOne({
                    userId: target.id,
                });
            }
            const isUserAlive = saverDocument.isAlive;
            const isTargetAlive = targetDocument.isAlive;
            const currentSec = new Date().getTime() / 1000;
            const cooldown = saverDocument.resurrectCooldown;

            if (currentSec >= cooldown) {
                if (isTargetAlive) {
                    await interaction.reply(`This user is still alive!`);
                    return;
                }
                const randnum = Math.floor(Math.random() * 100);

                // Core part : random results
                switch (true) {
                    // Successful
                    case randnum > 30 && randnum <= 100:
                        await User.findOneAndUpdate(
                            { userId: target.id },
                            { $set: { isAlive: true } },
                            { upsert: true }
                        );
                        await interaction.reply(
                            `${target} was brought back to the world by an angel :innocent: `
                        );
                        break;
                    // Not successful
                    case randnum > 20 && randnum < 30:
                        await interaction.reply(
                            `${target} was not resurrected because no angels are working rn. :joy: `
                        );
                        break;
                    // Not successful
                    default:
                        await interaction.reply(
                            `${target} landed back to the world in a volcano and burned alive :crying_cat_face: `
                        );
                        break;
                }
                // Add cooldown to the saver
                await User.findOneAndUpdate(
                    { userId: interaction.user.id },
                    { $set: { resurrectCooldown: currentSec + 30 } },
                    { upsert: true }
                );
            } else {
                // Cooldown is not over
                interaction.reply(
                    `Hey, slow down! You still need to wait **${Math.floor(
                        cooldown - currentSec
                    )}** seconds before you could resurrect again.`
                );
            }
        } catch (err) {
            handleError(interaction, err);
        }
    },
};
