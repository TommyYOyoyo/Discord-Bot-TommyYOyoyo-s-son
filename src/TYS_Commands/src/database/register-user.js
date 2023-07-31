// This script is dedicated to registering new users in the database.

const mongoose = require("mongoose");
const USER = require("../models/User.js");

module.exports = {
    registerUser: async function (user) {
        const User = mongoose.model("User", USER.userSchema, "Users");

        const userId = user.id;
        const username = user.username;
        const regDate = new Date().toString();
        const discrim = user.discriminator;
        const isBot = user.bot;

        try {
            const user = new User({
                userId: userId,
                username: username,
                registeredAt: regDate,
                discrim: discrim,
                isBot: isBot,
                isAlive: true,
                killCooldown: 0,
                nukeCooldown: 0,
                resurrectCooldown: 0,
            });
            await user.save();
        } catch (err) {
            console.error(err);
        }
    },
};
