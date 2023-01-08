const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('@discordjs/builders');

var yeetGifLinks = [
    "https://c.tenor.com/gISSJc70lH4AAAAC/yeet-naruto.gif",
    "https://c.tenor.com/jSx1KiL3L2UAAAAM/yeet-lion-king.gif",
    "https://c.tenor.com/utik-Y5Yx1MAAAAM/yeet-no.gif",
    "https://c.tenor.com/hp5oHnEqBoYAAAAM/kicking-out.gif",
    "https://c.tenor.com/hALMQJChDzAAAAAC/yeet-stickfigure.gif",
    "https://c.tenor.com/fDZZDOYVZb8AAAAM/frozen-olaf.gif",
    "https://c.tenor.com/yhz79wkknsYAAAAM/yeet-cat.gif",
    "https://c.tenor.com/tCPGyy8fUiUAAAAM/punt-kick.gif",
    "https://c.tenor.com/CRyixbGDSPkAAAAM/minecraft-yeet-yeet.gif"
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yeet')
        .setDescription('YEET! Bye bye!')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('User target to yeet!')
            .setRequired(true)),

    async execute(interaction) {
        let target = interaction.options.getUser('target')
        let msg = new EmbedBuilder()
            .setTitle(`YEET!!!!!!!!!!`)
            .setColor([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)])
            .setDescription(`POV ${interaction.user} yeeting ${target} to a galaxy far far far far away, maybe even out of the universe...Who knows?`)
            .setImage(yeetGifLinks[Math.floor(Math.random() * yeetGifLinks.length)])
        interaction.reply({
            embeds: [msg]
        })

    }
};