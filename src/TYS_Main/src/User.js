// User Schema for mongoose

const mongoose = require("mongoose");

module.exports = {
    userSchema: new mongoose.Schema(
        {
            username: String,
            userId: {
                type: Number,
                required: true,
                immutable: true,
            },
            registeredAt: {
                type: String,
                immutable: true,
                default: new Date().toString(),
            },
            discrim: Number,
            isBot: Boolean,
            isAlive: Boolean,
            killCooldown: Number,
            nukeCooldown: Number,
            resurrectCooldown: Number,
            rickrollCommand: String,
            rickrollPrefix: String
        }
    ),
};
