const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('@discordjs/builders');
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get helps about how to use this bot!'),

    async execute(interaction, client) {
        let maxPage = 3;
        let curPage = 1;

        let row = new ActionRowBuilder()
            .addComponents(
                firstBtn = new ButtonBuilder()
                .setCustomId('first')
                .setLabel('First page')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
            )
            .addComponents(
                previousBtn = new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('<<')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
            )
            .addComponents(
                nextBtn = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('>>')
                .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                lastBtn = new ButtonBuilder()
                .setCustomId('last')
                .setLabel('Last page')
                .setStyle(ButtonStyle.Success)
            )
        let btns = [firstBtn, lastBtn, previousBtn, nextBtn];

        // ###########################################################################

        let page1 = new EmbedBuilder()
            .setAuthor({
                name: 'Help menu',
                iconURL: 'https://i.postimg.cc/rwXj33rv/sonnnn.png'
            })
            .setTitle(`>>> Fun Helps`)
            .setColor([144, 238, 144])
            .addFields({
                name: "Kill",
                value: "Is killing random people fun...or dangerous..??"
            }, {
                name: "Resurrect",
                value: "Resurrect dead people!"
            }, {
                name: "Nuke",
                value: "Drop nukes to some place or to some specific people!"
            }, {
                name: "SetRR",
                value: "Wanna secretly rickroll people? Set an secret rickrolling command!"
            }, {
                name: "SetReplyBot",
                value: "Setup a funny reply bot to a specific channel. (for text commands like TYS SETREPLYBOT ...): to remove, simply write Tys setreplybot."
            }, {
                name: "Yeet",
                value: "Yeet people off the Earth, fun!!!"
            })
            .setFooter({
                text: `Page 1/${maxPage}. If you find any bugs, please report at https://discord.gg/wRtZ6fRhZC.`
            })

        let page2 = new EmbedBuilder()
            .setAuthor({
                name: 'Help menu',
                iconURL: 'https://i.postimg.cc/rwXj33rv/sonnnn.png'
            })
            .setTitle(`>>> Welcome & Goodbye Helps`)
            .setColor([144, 238, 144])
            .addFields({
                name: "SetWelcomeChannel",
                value: "Setup a channel where the bot can send welcome messages! (Text commands): To remove, simply write Tys setwelcomechannel."
            }, {
                name: "SetWelcomeImage",
                value: "Customize the welcoming image background to the image you want!"
            }, {
                name: "SetWelcomeMessage",
                value: "Customize the welcoming message to the message you want! Here's some words that could be useful to you in the message: USER = the member's username, SERVER = this server's name."
            }, {
                name: "SetByeMessage",
                value: "Make me say something when a member leaves the server! Here's some words that could be useful to you in the message: USER = the member's username, SERVER = this server's name, TOTALMEMBERS = the total number of members in the server."
            }, {
                name: "SetByeChannel",
                value: "Customize the channel where I will send a farewell message each time a member leaves!"
            })
            .setFooter({
                text: `Page 2/${maxPage}. If you find any bugs, please report at https://discord.gg/wRtZ6fRhZC.`
            })

            let page3 = new EmbedBuilder()
            .setAuthor({
                name: 'Help menu',
                iconURL: 'https://i.postimg.cc/rwXj33rv/sonnnn.png'
            })
            .setTitle(`>>> Utilities Helps`)
            .setColor([144, 238, 144])
            .addFields({
                name: "Info",
                value: "Get the basic infos about the bot."
            }, {
                name: "Invites",
                value: "Get the amount of invites a user has."
            }, {
                name: '\u200B',
                value: '\u200B'
            }, {
                name: 'More categories of commands coming soon!',
                value: ':)',
                inline: true
            }, )
            .setFooter({
                text: `Page 3/${maxPage}. If you find any bugs, please report at https://discord.gg/wRtZ6fRhZC.`
            })

        let pages = [page1, page2, page3];


        // ######################################################################

        let secs = 0;
        const endTime = 15

        async function countDown() {
            if (secs >= endTime) {
                for (item of btns) {
                    item.setDisabled(true);
                }
                await interaction.editReply({
                    embeds: [pages[curPage - 1]],
                    components: [row]
                })
                return;
            } else {
                secs += 1;
                setTimeout(() => {
                    countDown(interaction)
                }, 1000)
            }
        }

        await interaction.reply({
            embeds: [page1],
            components: [row]
        }).then(components => {
            const filter = i => i.deferred == false && !i.user.bot;
            const collector = components.createMessageComponentCollector({
                filter,
                time: 60000
            });

            countDown(collector)

            collector.on('collect', async i => {
                if (!i.isButton()) return;
                if (i.user.id == interaction.user.id) {
                    await i.deferUpdate()
                    if (i.customId == 'next') {
                        secs = 0;
                        curPage += 1
                        firstBtn.setDisabled(false)
                        previousBtn.setDisabled(false)
                        nextBtn.setDisabled(false)
                        if (curPage == maxPage) {
                            nextBtn.setDisabled(true)
                            lastBtn.setDisabled(true)
                        }
                        await i.editReply({
                            embeds: [pages[curPage - 1]],
                            components: [row]
                        })
                    } else if (i.customId == 'previous') {
                        secs = 0;
                        curPage -= 1
                        lastBtn.setDisabled(false)
                        previousBtn.setDisabled(false)
                        nextBtn.setDisabled(false)
                        if (curPage == 1) {
                            previousBtn.setDisabled(true)
                            firstBtn.setDisabled(true)
                        }
                        await i.editReply({
                            embeds: [pages[curPage - 1]],
                            components: [row]
                        })
                    } else if (i.customId == 'first') {
                        secs = 0;
                        curPage = 1
                        firstBtn.setDisabled(true)
                        lastBtn.setDisabled(false)
                        previousBtn.setDisabled(true)
                        nextBtn.setDisabled(false)
                        await i.editReply({
                            embeds: [pages[curPage - 1]],
                            components: [row]
                        })
                    } else if (i.customId == 'last') {
                        secs = 0;
                        curPage = maxPage
                        firstBtn.setDisabled(false)
                        lastBtn.setDisabled(true)
                        nextBtn.setDisabled(true)
                        previousBtn.setDisabled(false)
                        await i.editReply({
                            embeds: [pages[curPage - 1]],
                            components: [row]
                        })
                    }
                } else {
                    i.reply({
                        content: `This is not for you`,
                        ephemeral: true
                    });
                }
            });
            collector.on('end', (collected) => {
                for (item of btns) {
                    item.setDisabled(true);
                }
                interaction.editReply({
                    embeds: [pages[curPage - 1]],
                    components: [row]
                })
            });
        })
    }
};