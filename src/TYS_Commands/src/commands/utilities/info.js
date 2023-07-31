/*// Source code of the slash command Info

const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

const { handleError } = require("../../utils/errorHandling.js");

module.exports = {
    name: "info",
    description: "Get the basic informations about this bot.",

    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get the basic informations about the bot!"),

    async execute(interaction) {
        try {
            const guildCounts = client.guilds.cache.size;
            const sourceCode =
                "https://github.com/TommyYOyoyo/Discord-Bot-TommyYOyoyo-s-son";
            const uptimeSeconds = client.uptime / 1000;
            const uptimeHours = (uptimeSeconds / 3600).toFixed(2);

            const msg = new EmbedBuilder()
                .setTitle(`Informations about ${client.user.username}`)
                .setColor([
                    Math.floor(Math.random() * 255),
                    Math.floor(Math.random() * 255),
                    Math.floor(Math.random() * 255),
                ])
                .setAuthor({
                    name: "TommyYOyoyo's son",
                    iconURL: "https://i.postimg.cc/rwXj33rv/sonnnn.png",
                })
                .addFields(
                    {
                        name: "Creation date",
                        value: "Tue Jul 12 2022 14:56:10 GMT+0000 (Coordinated Universal Time)",
                        inline: true,
                    },
                    {
                        name: "Developer:",
                        value: "TommyYOyoyo#8835",
                        inline: true,
                    },
                    {
                        name: "Servers count:",
                        value: guildCounts.toString(),
                        inline: true,
                    },
                    {
                        name: "Bot prefix:",
                        value: "Slash command (/)",
                        inline: true,
                    },
                    {
                        name: "Time since last restart:",
                        value: `${uptimeHours.toString()}h`,
                        inline: true,
                    },
                    {
                        name: "Source code:",
                        value: sourceCode,
                        inline: true,
                    }
                )
                .setFooter({
                    text: 'Type "/help" to get helps about the commands available!!',
                });

            await interaction.reply({ embeds: [msg] });
        } catch (err) {
            handleError(interaction, err);
        }
    },
};
*/