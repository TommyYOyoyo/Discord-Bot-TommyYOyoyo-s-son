// invites tracker

module.exports = {
    async invitesTracker(cmd, user) {

        let invites = await cmd.guild.invites.fetch();
        let memberInvites = invites.filter(i => i.inviter.id === user.id);

        if (memberInvites.size <= 0) return `This user has 0 invites.`;

        let codes = memberInvites.map(i => i.code).join("\n");
        let index = 0;
        memberInvites.forEach(invite => index += invite.uses);

        return `${user} invited in total of **${index}** user(s) in this server. \n\nTheir invite codes: \n**${codes}**.`;
    }
};