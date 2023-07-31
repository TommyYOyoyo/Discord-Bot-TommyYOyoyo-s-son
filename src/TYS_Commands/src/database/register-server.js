// This script is dedicated to registering new users in the database.

const mongoose = require("mongoose");
const SERVER = require("../models/Server.js");

module.exports = {
    registerServer: async function (server) {
        const Server = mongoose.model("Server", SERVER.serverSchema, "Servers");

        const serverId = user.id;
        const serverName = user.username;

        try {
            const server = new Server({
                serverId: serverId,
                serverName: serverName,
            });
            await server.save();
        } catch (err) {
            console.error(err);
        }
    },
};
