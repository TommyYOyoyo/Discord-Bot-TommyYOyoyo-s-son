const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get the basic informations about the bot!'),

    async execute(interaction, client) {
        let creationDate = client.user.createdAt;
        let guildCounts = client.guilds.cache.size;
        let sourceCode = 'https://github.com/TommyYOyoyo/TommyYOyoyo-s-son-Bot';
        let uptimeSeconds = ((client.uptime) / 1000); 
        console.log(`[DEBUG] UptimeSeconds = ${uptimeSeconds}, uptime = ${client.uptime}`);
        let uptimeHours = (uptimeSeconds / 3600).toFixed(2);
        console.log(`[DEBUG] UptimeHours = ${uptimeHours}`);

        let msg = new EmbedBuilder()
            .setTitle(`Informations about ${client.user.username}`)
            .setColor([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)])
            .setAuthor({
                name: "TommyYOyoyo's son",
                iconURL: 'https://i.postimg.cc/rwXj33rv/sonnnn.png'
            })
            .addFields(
                { name: 'Creation date', value: creationDate.toString(), inline: true },
                { name: 'Developer:', value: 'TommyYOyoyo#8835', inline: true },
                { name: 'Servers count:', value: guildCounts.toString(), inline: true },
                { name: 'Bot prefix:', value: 'tys', inline: true },
                { name: 'Time since last restart:', value: `${uptimeHours.toString()}h`, inline: true },
                { name: 'Source code:', value: sourceCode, inline: true },
            )
            .setFooter({
                text: 'Type "tys help" to get helps about the commands available!!'
            })
        interaction.reply({embeds: [msg]})
    }
};