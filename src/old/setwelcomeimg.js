const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    PermissionFlagsBits
} = require('discord.js');

var db = require('../../js/db.js')

const isImageURL = require('image-url-validator').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setwelcomeimg')
        .setDescription('Personalize the background image that will be sent everytime a person joins a server!.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addStringOption(option =>
            option.setName('image')
            .setDescription('The background image which will be displayed.')
            .setRequired(false))
        .addStringOption(option =>
            option.setName('font-color')
            .setDescription('The font color in the welcome image, HEX CODES only.')
            .setRequired(false))
        .addBooleanOption(option =>
            option.setName('remove')
            .setDescription("Select true to remove the customized welcome images feature.")
            .setRequired(false)),

    async execute(interaction) {
        let imgSrc = interaction.options.getString('image');
        let isRemoving = interaction.options.getBoolean('remove');
        let fontColor = interaction.options.getString('font-color');

        if ((imgSrc == null || imgSrc == undefined) && (isRemoving == null || isRemoving == undefined)) {
            interaction.reply('Please enter an image source or select the option "remove".')
            return;
        }

        if (isRemoving){
            db.setKey(`server.${interaction.guild.id}.welcomeImg`, '');
            interaction.reply('Special welcoming images will now be disabled for your server!');
            return;
        }

        isImageURL(imgSrc).then(is_image => {
            if (is_image) {
                db.setKey(`server.${interaction.guild.id}.welcomeImg`, imgSrc.toString());
                if (fontColor != undefined || fontColor != null) {
                    if (!fontColor.startsWith('#') || !fontColor.length == 7){
                        interaction.reply("Your font color is not a HEX CODE.")
                        return;
                    }
                    db.setKey(`server.${interaction.guild.id}.welcomeImg.fontColor`, fontColor.toString());
                    interaction.reply("Image and font color set successfully!");
                    return;
                }
                interaction.reply("Image set successfully!");
                return;
            } else {
                interaction.reply("Sorry, your image link may have some problems :( \n Example of image link: https://c4.wallpaperflare.com/wallpaper/108/140/869/digital-digital-art-artwork-fantasy-art-drawing-hd-wallpaper-preview.jpg")
            }
        })
    }
};