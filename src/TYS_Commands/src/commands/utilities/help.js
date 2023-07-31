// Source code of the slash command "help"

const {
    SlashCommandBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require("@discordjs/builders");
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageButton,
    MessageActionRow,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");

const { handleError } = require("../../utils/errorHandling.js");

// These values will be used in the menu object
const author = {
    name: "/help",
    iconURL: "https://i.postimg.cc/rwXj33rv/sonnnn.png",
};
const color = [50, 222, 138];

// A function used to update the buttons
function getButtons(currentPage, maxPage) {

    const components = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("first")
            .setLabel("First Page")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(!(currentPage > 0)), // Disable if user on first page
        new ButtonBuilder()
            .setCustomId("previous")
            .setLabel("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(!(currentPage > 0)), // Disable if user on first page
        new ButtonBuilder()
            .setCustomId("next")
            .setLabel("➡️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage == maxPage), // Disable if user on last page
        new ButtonBuilder()
            .setCustomId("last")
            .setLabel("Last Page")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(currentPage == maxPage) // Disable if user on last page
    );

    return components;
}

// Absolute path of the command directory
const commandsDir = path.resolve("./src/commands/");

// An object that stores all the categories and pages of the Help Menu
let menu = {
    init: [
        new EmbedBuilder()
            .setAuthor(author)
            .setTitle("Select a category of commands")
            .setColor([50, 222, 138])
            .addFields(
                {
                    name: "Fun Commands",
                    value: "Slash commands with fun purposes, such as /kill, /nuke and /yeet.",
                },
                {
                    name: "Utility Commands",
                    value: "Useful slash commands, such as /info and /invites.",
                },
                {
                    name: "Welcome-Goodbye Commands",
                    value: "Slash commands dedicated to personalize the welcome-goodbye features, such as the Welcome Image and the Goodbye message.",
                }
            )
            .setFooter({
                text: "Page 1/1. \nHave you found any issues? Or... any suggestions? Join this server to post your reports and your ideas! https://discord.gg/wRtZ6fRhZC",
            }),
    ],
};

// ========================================================================================================================================================================
// Dynamically adding commands in the help menu
// This part is executed when the bot is launched
try {
    const commandFolders = fs.readdirSync(commandsDir);

    for (const folder of commandFolders) {
        const commandsPath = path.join(commandsDir, folder); // commands folder path
        const files = fs // Array of all .js command files in the folder
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(".js"));
        // A file index to help me easily track the number of files fetched
        let fileIndex = 0;
        // A variable that keeps me tracked with the embed page in which I should add command details
        let embedIndex = 0;
        // Retrieve the number of files in a folder
        const folderLength = fs.readdirSync(commandsPath).length;

        for (const file of files) {
            
            fileIndex += 1;

            // The following part will be IGNORED if the fileIndex does not match the conditions to create a new page
            // Create a new page at each time we reach 5 commands
            // e.g : 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
            //       ^              ^               ^
            if (fileIndex % 5 == 1) {
                // Create an empty array if not created
                if (menu[`${folder}`] == undefined) menu[`${folder}`] = [];
                // Embed page creation
                menu[`${folder}`].push(
                    new EmbedBuilder()
                        .setAuthor(author)
                        .setTitle(
                            folder.charAt(0).toUpperCase().toString() +
                                folder.slice(1).replace("_", "-") +
                                " Commands"
                        )
                        .setColor(color)
                );

                // Update the embed index if the current index is not 0
                //      ( increasing it in this case would cause it to be 1 index
                //       higher than the expected one and would cause errors )
                menu[`${folder}`].length <= 1
                    ? (embedIndex = embedIndex)
                    : embedIndex++;

                // The setFooter part is seperated from the main embed creation code in order to avoid incorrect paging issues
                menu[`${folder}`][embedIndex].setFooter({
                    text: `Page ${embedIndex + 1}/${
                        // Determine the number of pages that will be created
                        folderLength.length % 5 == 0
                            ? folderLength / 5
                            : Math.ceil(folderLength / 5)
                    }. \nTo report bugs or to post ideas, please visit the following server at #bugs-report. https://discord.gg/wRtZ6fRhZC`,
                });
            }
            // Import datas of the command file
            const command = require(path.join(commandsPath, file));
            // Add fields that contain the name and description of every command into embeds
            if ("name" in command && "description" in command) {
                menu[`${folder}`][embedIndex].addFields({
                    name: `/${command.name}`,
                    value: command.description,
                });
            } else {
                // In case the command file is incomplete
                console.log(
                    `[WARNING] Help Generation - Name and Description not found in ${file} \n`
                );
            }
        }
    }
    console.log(
        `${new Date().toString()} [HELP COMMAND] Help menu generated successfully. \n`
    );
} catch (err) {
    handleError(undefined, err);
}

// =============================================================================================================================

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription(
            "Are you confused about how to use this bot? Well, this command will help you out!"
        ),

    async execute(interaction) {
        // Build the select menu
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("menu")
            .setPlaceholder("Select the category of help you want to receive.")
            .addOptions(
                (selection_fun = new StringSelectMenuOptionBuilder()
                    .setLabel("Fun")
                    .setDescription(
                        "Fun slash commands, such as /nuke and /yeet."
                    )
                    .setValue("fun")),
                (selection_utils = new StringSelectMenuOptionBuilder()
                    .setLabel("Utilities")
                    .setDescription(
                        "Utility commands, such as /invites and /info."
                    )
                    .setValue("utils")),
                (selection_welcomeBye = new StringSelectMenuOptionBuilder()
                    .setLabel("Welcome-Goodbye")
                    .setDescription(
                        "Commands dedicated to setup the welcome-goodbye system."
                    )
                    .setValue("welcomebye"))
            );
        // Place the select menu into the action row
        const selectMenuRow = new ActionRowBuilder().addComponents(selectMenu);
        // Filter for the interaction collector
        const filter = (i) => i.deferred == false && !i.user.bot;

        try {
            // Two values that will help me to easily track the page index and help category
            let currentPage = 0;
            let currentCategory = menu.init; // It is temporarily put with an array of one value in order to make its length 1.
            // Sending the embed message, the drop menu and the buttons as a reply
            const response = await interaction.reply({
                embeds: [currentCategory[currentPage]],
                components: [
                    selectMenuRow,
                    getButtons(currentPage, currentCategory.length - 1),
                ],
            });
            // Interaction collector
            const collector = response.createMessageComponentCollector({
                filter: filter,
                time: 120000,
            });
            // Handling received interactions from the collector
            collector.on("collect", async (i) => {
                if (i.user.id == interaction.user.id) {
                    // If the interaction received is not from the buttons nor from the select menu, do nothing.
                    if (!i.isButton() && !i.isStringSelectMenu()) return;
                    // Defer the reply since the command takes longer time than usual to complete
                    await i.deferUpdate();
                    // Button handling starts here
                    if (i.isButton()) {
                        // Update the page according to the interaction of the user
                        switch (i.customId) {
                            case "previous":
                                currentPage -= 1;
                                break;
                            case "next":
                                currentPage += 1;
                                break;
                            case "first":
                                currentPage = 0;
                                break;
                            case "last":
                                currentPage = currentCategory.length - 1;
                                break;
                            default:
                                handleError(i, "Unknown button interaction.");
                        }

                        // Update the embed message;
                        await i.editReply({
                            embeds: [currentCategory[currentPage]],
                            components: [
                                selectMenuRow,
                                getButtons(
                                    currentPage,
                                    currentCategory.length - 1
                                ),
                            ],
                        });

                        // Select Menu Handling
                    } else if (i.isStringSelectMenu()) {
                        // i.values[0] is the command category that the user had chosen
                        switch (i.values[0]) {
                            case "fun":
                                currentCategory = menu.fun;
                                break;
                            case "utils":
                                currentCategory = menu.utilities;
                                break;
                            case "welcomebye":
                                currentCategory = menu.welcome_goodbye;
                                break;
                            default:
                                currentCategory = menu.init;
                                break;
                        }
                        currentPage = 0; // Reset the page number
                        await interaction.editReply({
                            embeds: [currentCategory[currentPage]],
                            components: [
                                selectMenuRow,
                                getButtons(
                                    currentPage,
                                    currentCategory.length - 1
                                ),
                            ],
                        });
                    }
                    // A non-command-caller user tries to interact with the command
                } else {
                    await i.deferUpdate();
                    await i.followUp({
                        content: `This is not for you.`,
                        ephemeral: true,
                    });
                }
            });
            collector.on("end", async () => {
                // Disable the buttons to avoid making the users interact with buttons which can no longer receiving interactions
                const buttonsRow = getButtons(0, 0);
                for (const button of buttonsRow.components)
                    await button
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true);
                // Refresh menu
                await interaction.editReply({
                    embeds: [currentCategory[currentPage]],
                    components: [selectMenuRow, buttonsRow],
                });
                return;
            });
        } catch (err) {
            // An error has occured;
            handleError(interaction, err);
        }
    },
};
