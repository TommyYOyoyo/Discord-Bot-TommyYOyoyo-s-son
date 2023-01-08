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

    async execute(interaction, client, listCmds) {
        let maxPage = 3;
        let curPage = 1;

        let categories = listCmds.getCates();
        let funCmds = listCmds.getCmds(listCmds.liCmds.categories.FUN)
        let welcomeCmds = listCmds.getCmds(listCmds.liCmds.categories.WELCOMING)
        let utilityCmds = listCmds.getCmds(listCmds.liCmds.categories.UTILITIES)

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
        let btns = [firstBtn, lastBtn, previousBtn, nextBtn]
        let page1 = new EmbedBuilder()
            .setAuthor({
                name: 'Help menu',
                iconURL: 'https://i.postimg.cc/rwXj33rv/sonnnn.png'
            })
            .setTitle(`>>> ${categories[0]} Helps`)
            .setColor([144, 238, 144])
            .addFields({
                name: funCmds[0][0],
                value: funCmds[0][1]
            }, {
                name: funCmds[1][0],
                value: funCmds[1][1]
            }, {
                name: funCmds[2][0],
                value: funCmds[2][1]
            }, {
                name: funCmds[3][0],
                value: funCmds[3][1]
            }, {
                name: funCmds[4][0],
                value: funCmds[4][1]
            }, {
                name: funCmds[5][0],
                value: funCmds[5][1]
            })
            .setFooter({
                text: `Page 1/${maxPage}. If you find any bugs, please report at https://discord.gg/wRtZ6fRhZC.`
            })

        let page2 = new EmbedBuilder()
            .setAuthor({
                name: 'Help menu',
                iconURL: 'https://i.postimg.cc/rwXj33rv/sonnnn.png'
            })
            .setTitle(`>>> ${categories[1]} Helps`)
            .setColor([144, 238, 144])
            .addFields({
                name: welcomeCmds[0][0],
                value: welcomeCmds[0][1],
            }, {
                name: welcomeCmds[1][0],
                value: welcomeCmds[1][1],
            }, {
                name: welcomeCmds[2][0],
                value: welcomeCmds[2][1],
            }, {
                name: welcomeCmds[3][0],
                value: welcomeCmds[3][1],
            }, {
                name: welcomeCmds[4][0],
                value: welcomeCmds[4][1],
            })
            .setFooter({
                text: `Page 2/${maxPage}. If you find any bugs, please report at https://discord.gg/wRtZ6fRhZC.`
            })

            let page3 = new EmbedBuilder()
            .setAuthor({
                name: 'Help menu',
                iconURL: 'https://i.postimg.cc/rwXj33rv/sonnnn.png'
            })
            .setTitle(`>>> ${categories[2]} Helps`)
            .setColor([144, 238, 144])
            .addFields({
                name: utilityCmds[0][0],
                value: utilityCmds[0][1],
            }, {
                name: utilityCmds[1][0],
                value: utilityCmds[1][1],
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

        let pages = [page1, page2, page3]

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