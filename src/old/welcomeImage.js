// welcome image

const {
    AttachmentBuilder,
    BitField,
    ContextMenuCommandAssertions
} = require('discord.js');
const {
    createCanvas,
    loadImage,
    registerFont
} = require("canvas");
const e = require('express');
const db = require('../../TYS_Main/src/db');

registerFont('./fonts/SF-Pro-Display-Regular.otf', {
    family: 'SF Pro Display Regular'
});
registerFont('./fonts/SF-Pro-Rounded-Light.otf', {
    family: 'SF Pro Rounded Light'
});
registerFont('./fonts/SF-Pro-Text-Thin.otf', {
    family: 'SF Pro Text Thin'
});
registerFont('./fonts/SF-Pro-Text-Ultralight.otf', {
    family: 'SF Pro Text Ultralight'
});
registerFont('./fonts/SF-Pro-Display-Semibold.otf', {
    family: 'SF Pro Text Semibold'
});
registerFont('./fonts/ChuterolkFreeRegular-L3R55.ttf', {
    family: 'Chuterolk Reg'
});


var dim = {
    height: 896,
    width: 2376,
    margin: 100
}

const av = {
    size: 512,
    get x() {
        return dim.width / 3.3 - this.size
    },
    get y() {
        return (dim.height - this.size) / 2
    }
}

module.exports = {
    genWelcomeImg: async function (member, wimg) {
        function decideLength(len) {
            if (len < 5) {
                return 160;
            } else if (len < 8){
                return len * 20
            } else if (len >= 8 && len < 10){
                return len * 15
            } else if (len > 10 && len <= 15){
                return len * 18
            } else if (len > 15 && len <= 19) {
                return len * 11;
            } else if (len > 19 && len <= 24) {
                return len * 8
            } else if (len > 24 && len <= 35){
                return len;
            } else {
                return len * 0.75;
            }
        }

        const userName = member.user.username;
        const discrim = member.user.discriminator;
        let serverName = member.guild.name;
        const totalMembs = member.guild.memberCount;
        const userNameAlign = dim.width / 3 * 2;
        const avatar = member.user.displayAvatarURL({
            extension: 'jpg',
            dynamic: false,
            size: av.size
        })
        let fontColor = await db.getKey(`server.${member.guild.id}.welcomeImg.fontColor`);

        if (fontColor == undefined){
            fontColor = '#ffffff';
        }

        const canvas = createCanvas(dim.width, dim.height)
        const ctx = canvas.getContext('2d')
        ctx.save()

        let bg = await loadImage(wimg)
        ctx.drawImage(bg, 0, 0, dim.width, dim.height)
        //welcoming
        ctx.fillStyle = fontColor;
        ctx.font = '80px "SF Pro Text Thin"'
        ctx.fillText(`Welcome to`, dim.width / 2 - 80, 320);
        //server name
        ctx.font = `80px "SF Pro Display Regular"`
        if (serverName.length > 18){
            serverName = serverName.slice(0, 18)+'...';
        }
        ctx.fillText(`${serverName}`, dim.width / 2 + 380, 320);
        // username
        ctx.textAlign = 'center';
        ctx.font = `${decideLength(userName.length+discrim.length).toString()}px "Chuterolk Reg"`
        let name = `${userName}#${discrim}`;
        ctx.fillText(name, userNameAlign, dim.height / 2 + 70);
        // member count
        ctx.font = '100px "SF Pro Text Thin"';
        ctx.fillText(`We are ${totalMembs} now!`, userNameAlign, dim.height / 2 + 180);
        // arc
        ctx.globalAlpha = 0.55
        ctx.strokeStyle = "	#303030"
        ctx.lineWidth = 25
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.arc(dim.width / 3.3 - av.size / 2, dim.height / 2, 512 / 2 + 60, 0.4 * Math.PI, 1.2 * Math.PI)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(dim.width / 3.3 - av.size / 2, dim.height / 2, 512 / 2 + 60, 1.4 * Math.PI, 2.2 * Math.PI)
        ctx.stroke()
        ctx.restore()
        // arc
        ctx.strokeStyle = '#3AA8C1'
        ctx.lineWidth = 25
        ctx.lineCap = 'round';
        ctx.beginPath()
        ctx.arc(dim.width / 3.3 - av.size / 2, dim.height / 2, 512 / 2 + 120, 0.1 * Math.PI, 0.5 * Math.PI)
        ctx.stroke()
        ctx.strokeStyle = '#0062FF'
        ctx.beginPath()
        ctx.arc(dim.width / 3.3 - av.size / 2, dim.height / 2, 512 / 2 + 120, 1.1 * Math.PI, 1.5 * Math.PI)
        ctx.stroke()
        ctx.restore()
        // glow
        ctx.beginPath()
        ctx.shadowColor = "#FFFFFF";
        ctx.shadowOffsetX = 2 * (dim.width / 3.3 - av.size / 2);
        ctx.shadowBlur = 30;
        ctx.arc(-(dim.width / 3.3 - av.size / 2), dim.height / 2, 512 / 2 + 2, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.restore()
        // user image
        let avatarImg = await loadImage(avatar)
        let tysImg = await loadImage("https://i.postimg.cc/rwXj33rv/sonnnn.png")
        ctx.beginPath()
        ctx.arc(dim.width / 3.3 - av.size / 2, dim.height / 2, 512 / 2 + 2, 0, 2 * Math.PI)
        ctx.arc(dim.width / 3 + 60, 110, 60, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.clip()
        // display the two pfps
        ctx.drawImage(avatarImg, av.x, av.y, av.size, av.size)
        ctx.drawImage(tysImg, dim.width / 3, 50, 120, 120)

        return canvas.toBuffer()
    }
}