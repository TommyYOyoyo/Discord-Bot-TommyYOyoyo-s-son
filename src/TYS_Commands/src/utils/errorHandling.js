// Error handling module for handling unexpected errors

module.exports = {
    handleError: async function (interaction, err) {

        console.error(err);

        // Interaction was not given
        if (interaction == undefined) return;

        // Notice the user that an error had occured
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: `There was an error while executing this command! Please report this issue in this server: https://discord.gg/wRtZ6fRhZC at #bugs-report
                    \nError message: ${err}`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `There was an error while executing this command! Please report this issue in this server: https://discord.gg/wRtZ6fRhZC at #bugs-report
                    \nError message: ${err}`,
                ephemeral: true,
            });
        }
    },
};
