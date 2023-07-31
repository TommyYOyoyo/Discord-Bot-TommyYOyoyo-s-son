// User Schema for mongoose

const mongoose = require("mongoose");

module.exports = {
    serverSchema: new mongoose.Schema(
        {
            serverName: String,
            serverId: {
                type: Number,
                required: true,
            },
            welcomeImg: Object,
            welcomeChannel: String,
            byeChannel: String,
            welcomeMessage: String,
            byeMessage: String,
            replyBotChannel: Number,
        },
        { collection: "Servers" }
    ),
};
