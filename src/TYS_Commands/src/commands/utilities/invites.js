/*const {
    SlashCommandBuilder
} = require('@discordjs/builders');

var invitetracker = require('../js/inviteTracker.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites')
        .setDescription('Get the amount of invites a user has.')
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The target user')
            .setRequired(true)),

    async execute(interaction){
        let targetUser = interaction.options.getUser('user');
        let content = await invitetracker.invitesTracker(interaction, targetUser);
        interaction.reply(`${content}`);
    }
}
*/