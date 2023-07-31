// Source code of the slash command Yeet

const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

const yeetGifLinks = [
    "https://c.tenor.com/gISSJc70lH4AAAAC/yeet-naruto.gif",
    "https://c.tenor.com/jSx1KiL3L2UAAAAM/yeet-lion-king.gif",
    "https://c.tenor.com/utik-Y5Yx1MAAAAM/yeet-no.gif",
    "https://c.tenor.com/hp5oHnEqBoYAAAAM/kicking-out.gif",
    "https://c.tenor.com/hALMQJChDzAAAAAC/yeet-stickfigure.gif",
    "https://c.tenor.com/fDZZDOYVZb8AAAAM/frozen-olaf.gif",
    "https://c.tenor.com/yhz79wkknsYAAAAM/yeet-cat.gif",
    "https://c.tenor.com/tCPGyy8fUiUAAAAM/punt-kick.gif",
    "https://c.tenor.com/CRyixbGDSPkAAAAM/minecraft-yeet-yeet.gif",
];

const { handleError } = require("../../utils/errorHandling.js");

module.exports = {
    // The following two variables are used for the Help Command
    name: "yeet",
    description: "Virtually yeeeeeet somebody away. This command will not kill the target (but the target will likely be half-dead).",

    data: new SlashCommandBuilder()
        .setName("yeet")
        .setDescription("Virtually yeeeeeeeet somebody away.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("User target to yeet!")
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const target = interaction.options.getUser("target");
            let msg = new EmbedBuilder()
                .setTitle(`YEET!!!!!!!!!!`)
                .setColor([
                    Math.floor(Math.random() * 255),
                    Math.floor(Math.random() * 255),
                    Math.floor(Math.random() * 255),
                ])
                .setDescription(
                    `POV ${interaction.user} yeeting ${target} to a galaxy far far far far away, maybe even out of the universe...Who knows?`
                )
                .setImage(
                    yeetGifLinks[
                        Math.floor(Math.random() * yeetGifLinks.length)
                    ]
                );
            await interaction.reply({
                embeds: [msg],
            });
        } catch (err) {
            handleError(interaction, err);
        }
    },
};
