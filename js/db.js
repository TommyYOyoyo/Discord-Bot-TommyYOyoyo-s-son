// Bot Database here (free tho has limits :( )

const Database = require("@replit/database");
const db = new Database();

module.exports = {
    setKey: async function (key, val) {
        try {
            await db.set(key, val);
        } catch (err) {
            console.log(err);
        }
    },
    deleteKey: async function (key) {
        try {
            await db.delete(`${key}`);
        } catch (err) {
            console.log(err);
        }
    },
    getKey: async function (key) {
        try {
            let value = await db.get(key);
            return value;
        } catch (err) {
            console.log(err);
        }
    },
    listKeyPrefix: async function (prefix) {
        try {
            let matches = await db.list(prefix);
            return matches;
        } catch (err) {
            console.log(err);
        }
    },
    listAll: async function () {
        try {
            let result = await db.list();
            return result;
        } catch (err) {
            console.log(err);
        }
    }
}