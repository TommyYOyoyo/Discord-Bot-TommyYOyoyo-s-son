// utils

var db = require('./db.js');

module.exports = {
    checkAlive: async function (userId) {
        let haveAlive = false;
        let value = await db.getKey(`user.${userId}.alive`)
        if (value == 0) {
            haveAlive = true;
            return false;
        } else if (value == 1) {
            haveAlive = true;
            return true;
        } else {
            haveAlive = false;
            db.setKey(`user.${userId}.alive`, '1')
        }
    }
}
