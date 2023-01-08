// Reply Bot

var db = require('./db.js');
var replies = require('./replies.js');
var myId = process.env.BOT_ID;

module.exports = {
    replyBot: function (message) {
        db.getKey(`server.${message.guild.id}.replybot`).then((channelId) => {
            if (message.channel.id == channelId && !message.author.bot) {
                let LowercasedMsg = message.content.toLowerCase()
                replies.reply(message, LowercasedMsg)
            } else {
                return;
            }
        })
    }
}