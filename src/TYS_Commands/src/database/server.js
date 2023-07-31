// Module that connects this project with the MongoDB database using Mongoose

module.exports = {
    connect: async function () {

        const uri = `mongodb+srv://TommyYOyoyo:${process.env.MONGO_PASSWORD}@db1.shjo7al.mongodb.net/TYS?retryWrites=true&w=majority`;
        const mongoose = require("mongoose");

        try {
            await mongoose.connect(uri); // Block further actions until the connection is established.
            console.log(`${new Date().toString()} [SERVER] Successfully connected to MongoDB using Mongoose. \n`)
        } catch (err) {
            console.error(err);
        }

        return client;
    },
};
