// Source code of the slash command "kill"

const { SlashCommandBuilder } = require("@discordjs/builders");

const mongoose = require("mongoose");
const USER = require("../../models/User.js");
const { registerUser } = require("../../database/register-user.js");
const { handleError } = require("../../utils/errorHandling.js");

module.exports = {
    // The following two variables are used for the Help Command
    name: "kill",
    description: "Virtually kill a specific target in a brutal way. Howeverrrr, accidents could occur when you attempt to do so.",

    data: new SlashCommandBuilder()
        .setName("kill")
        .setDescription(
            "Virtually kill a specific target in a brutal way. Buuuuuut, you could also fail to do so."
        )
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Enter the target you want to kill!")
                .setRequired(false)
        ),

    async execute(interaction) {
        const User = mongoose.model("Users", USER.userSchema, "Users");

        try {
            // Target user
            let target = interaction.options.getUser("target");
            if (target == undefined) target = interaction.user;
            // Retrieve datas of the two involved users from the database
            let attackerDocument = await User.findOne({
                userId: interaction.user.id,
            });
            let targetDocument = await User.findOne({
                userId: target.id,
            });
            // Detect if user or target is a new user (if they are registered in the db)
            // If not, register them to the database and retrieve the new values
            if (attackerDocument == null) {
                await registerUser(interaction.user);
                attackerDocument = await User.findOne({
                    userId: interaction.user.id,
                });
            }
            if (targetDocument == null) {
                await registerUser(target);
                targetDocument = await User.findOne({
                    userId: target.id,
                });
            }
            // Retrieving the informations about the command user's current status and their inputs
            const currentSec = new Date().getTime() / 1000;
            const cooldown = attackerDocument.killCooldown;
            const isUserAlive = attackerDocument.isAlive;
            const isTargetAlive = targetDocument.isAlive;

            if (isUserAlive) {
                if (currentSec >= cooldown) {
                    // Detect "Suicide"
                    if (target.id == interaction.user.id) {
                        await interaction.reply(
                            `Ah man, ${interaction.user} commited suicide.`
                        );
                        await User.findOneAndUpdate(
                            { userId: interaction.user.id },
                            { $set: { isAlive: false } },
                            { upsert: true }
                        );
                        return;
                    }
                    // Target is alive, proceed to the killing operation
                    if (isTargetAlive) {
                        const randnum = Math.floor(Math.random() * 100);
                        // Random operation #1: success
                        if (randnum > 50 && randnum <= 100) {
                            await User.findOneAndUpdate(
                                { userId: target.id },
                                { $set: { isAlive: false } },
                                { upsert: true }
                            );
                            await interaction.reply(
                                `${interaction.user} blew off the head of ${target} with a shotgun, oof.`
                            );
                            // Random operation #2: neither die
                        } else if (randnum > 20 && randnum <= 50) {
                            await interaction.reply(
                                `${target} walked away before ${interaction.user} could kill them.`
                            );
                            // Random operation #1: fail and punish
                        } else {
                            await User.findOneAndUpdate(
                                { userId: interaction.user.id },
                                { $set: { isAlive: false } },
                                { upsert: true }
                            );
                            await interaction.reply(
                                `${interaction.user} accidently put a carrot in their shotgun and killed themselves.`
                            );
                        }
                        // Adding cooldown to the user
                        await User.findOneAndUpdate(
                            { userId: interaction.user.id },
                            { $set: { killCooldown: currentSec + 30 } },
                            { upsert: true }
                        );
                    } else {
                        // Target already dead
                        await interaction.reply(
                            `Hey, this user is already dead. How are you supposed to kill a dead person?`
                        );
                    }
                } else {
                    // Cooldown still active
                    await interaction.reply(
                        `Hey, overkilling is not good! You still need to wait **${Math.floor(
                            cooldown - currentSec
                        )}** seconds before you could kill again!`
                    );
                }
            } else {
                // Attacker is dead
                await interaction.reply(
                    "Hey, you are dead, how are you supposed to kill if you are dead?"
                );
            }
        } catch (err) {
            handleError(interaction, err);
        }
    },
};
