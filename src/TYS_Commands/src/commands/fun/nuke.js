// Source code of the slash command Nuke

const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

const mongoose = require("mongoose");
const USER = require("../../models/User.js");
const { registerUser } = require("../../database/register-user");
const { handleError } = require("../../utils/errorHandling.js");

const nukeGifLinks = [
    "https://c.tenor.com/giN2CZ60D70AAAAC/explosion-mushroom-cloud.gif",
    "https://c.tenor.com/YE_vkc5cRxUAAAAM/kaboom-boom.gif",
    "https://c.tenor.com/h4n4Y_HfjhMAAAAM/haha-bongo-cat.gif",
    "https://c.tenor.com/EkW1bQdRl2MAAAAC/explodinghehemwhaha.gif",
    "https://media.discordapp.net/attachments/860285099832639491/998418051890425977/unknown.gif",
    "https://media.discordapp.net/attachments/860285099832639491/998418069095448616/unknown.gif",
];

module.exports = {
    // The following two variables are used for the Help Command
    name: "nuke",
    description: "Virtually nuke and completely reduce a specific place / group of targets into dusts. Accidents could occur when you drop the nuke.",

    data: new SlashCommandBuilder()
        .setName("nuke")
        .setDescription(
            "Virtually nuke and completely reduce a specific place / group of targets into dusts."
        )
        .addStringOption((option) =>
            option
                .setName("place")
                .setDescription("Place(s) you desire to nuke")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("target1")
                .setDescription("User target to nuke")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("target2")
                .setDescription("User target to nuke")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("target3")
                .setDescription("User target to nuke")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("target4")
                .setDescription("User target to nuke")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("target5")
                .setDescription("User target to nuke")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("target6")
                .setDescription("User target to nuke")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("target7")
                .setDescription("User target to nuke")
                .setRequired(false)
        )
        .addUserOption((option) =>
            option
                .setName("target8")
                .setDescription("User target to nuke")
                .setRequired(false)
        ),

    async execute(interaction) {
        const User = mongoose.model("Users", USER.userSchema, "Users");

        try {
            // Acquire database informations about the nuker
            let nukerDocument = await User.findOne({
                userId: interaction.user.id,
            });
            // Register nuker if they are not registered in the database yet
            if (nukerDocument == null) {
                await registerUser(interaction.user);
                nukerDocument = await User.findOne({
                    userId: interaction.user.id,
                });
            }
            // Acquire informations about the response sent
            let place = interaction.options.getString("place");
            let duplicatedTargets = [];
            // Push all the valid targets into an array
            for (let i = 0; i <= 8; i++) {
                const user = interaction.options.getUser(`target${i}`);
                if (user != undefined) duplicatedTargets.push(user);
            }
            // Convert an array into a set to remove duplcates and turn it back to an array
            let targets = Array.from(new Set(duplicatedTargets));
            // If no arguments is entered, nuke the command user themselves >:)
            if (targets.length == 0 && place == null)
                place = `${interaction.user}'s house`;
            const currentSec = new Date().getTime() / 1000;
            const cooldown = nukerDocument.nukeCooldown;
            const isUserAlive = nukerDocument.isAlive;

            // User is alive
            if (isUserAlive) {
                // Cooldownw is over
                if (currentSec >= cooldown) {
                    // Random chance
                    let randnum = Math.floor(Math.random() * 100);
                    let gif;
                    let reply;
                    // A string that contains all the information about the targets and place
                    let specifiedTgt;

                    // Setting up the specifiedTgt
                    if (targets.length > 0) {
                        // Creating a string that contains all victim targets
                        let victims = "";
                        switch (targets.length) {
                            case 1:
                                victims = `${targets[0]}`;
                                break;
                            case 2:
                                victims = `${targets[0]} and ${targets[1]}`;
                                break;
                            case 3:
                                victims = `${targets[0]}, ${targets[1]} and ${targets[2]}`;
                                break;
                            // >= 4 people
                            default:
                                // List all the targets until the 2 last ones
                                for (let i = 0; i < targets.length - 2; i++)
                                    victims += `${targets[i]}, `;
                                // last 2 elements
                                //victims += `${targets[targets.length-3]}, ${targets[targets.length-2]} and ${targets[targets.length-1]}`;
                                //break;
                                victims += `${
                                    targets[targets.length - 2]
                                } and ${targets[targets.length - 1]}`;
                                break;
                        }
                        if (typeof place != undefined && place != null) {
                            specifiedTgt = `${place} and also to `;
                            specifiedTgt += victims;
                            // Place is not given
                        } else specifiedTgt = victims;
                        // Victims are not given
                    } else specifiedTgt = place;

                    // Core part -> random results
                    switch (true) {
                        // Nuke is successful
                        case randnum > 50 && randnum <= 95:
                            reply = `${interaction.user} dropped a nuke to ${specifiedTgt}. TOTAL DESTRUCTION! \n\n**POV** the nuclear strike zone:`;
                            gif = `${
                                nukeGifLinks[
                                    Math.floor(
                                        Math.random() * nukeGifLinks.length
                                    )
                                ]
                            }`;
                            // Set the isAlive value of each target to false
                            if (targets != []) {
                                await Promise.all(
                                    targets.map(async (usr) => {
                                        const targetDocument =
                                            await User.findOne({
                                                userId: usr.id,
                                            });
                                        // Register the target if they are not registered in the database yet
                                        if (targetDocument == null)
                                            await registerUser(usr);

                                        await User.findOneAndUpdate(
                                            { userId: usr.id },
                                            { $set: { isAlive: false } },
                                            { upsert: true }
                                        );
                                    })
                                );
                            }
                            break;
                        // Nuke is not successful
                        case randnum > 20 && randnum < 30:
                            reply = `${interaction.user} tried to drop a nuke but the Navy intercepted them. **WHAT A KARMA!**`;
                            break;
                        // Nuke is not successful and the nuker dies
                        case randnum > 30 && randnum <= 49:
                            reply = `${interaction.user} dropped the nuke to ${specifiedTgt} but the poorly programmed nuke flew back to their plane. **TO BE CONTINUED...**`;
                            await User.findOneAndUpdate(
                                { userId: interaction.user.id },
                                { $set: { isAlive: false } },
                                { upsert: true }
                            );
                            break;
                        // Nuke is not successful
                        case randnum > 95 && randnum <= 100:
                            reply = `${interaction.user} dropped the nuke to ${specifiedTgt} but everyone there magically survived! **MAGIK!** \n\nPOV ${place}:`;
                            gif =
                                "https://c.tenor.com/8gpittE_R9oAAAAM/running-dodging.gif";
                            break;
                        // Nuke is not successful
                        default:
                            reply = `Bro stop dreaming about nukes and go get a job man :joy:`;
                            break;
                    }

                    // Embedded message generation
                    const randomColor1 = Math.floor(Math.random() * 255);
                    const randomColor2 = Math.floor(Math.random() * 255);
                    const randomColor3 = Math.floor(Math.random() * 255);
                    const nukeMsg = new EmbedBuilder()
                        .setColor([randomColor1, randomColor2, randomColor3])
                        .setTitle(
                            `${interaction.user.username}'s nuking process...`
                        )
                        .setDescription(`${reply}`)
                        .setImage(gif);

                    // Send embedded message
                    await interaction.reply({
                        embeds: [nukeMsg],
                    });

                    // Adding cooldown to the user
                    await User.findOneAndUpdate(
                        { userId: interaction.user.id },
                        { $set: { nukeCooldown: currentSec + 60 } },
                        { upsert: true }
                    );
                } else {
                    // Cooldown is not over
                    await interaction.reply(
                        `Yo slow down, your factory is still manufacturing the nuke lol. You still need to wait **${Math.floor(
                            cooldown - currentSec
                        )}** seconds before you could throw another nuke.`
                    );
                }
            } else {
                // Nuker is dead
                await interaction.reply(
                    "Hey, you are dead, how are you supposed to nuke if you are dead?"
                );
            }
        } catch (err) {
            handleError(interaction, err);
        }
    },
};
