const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSch = new Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    emailId: {
        type: String
    },
    itemId: {
        type: String
    },
    bidAmt: {
        type: Number
    }
})

module.exports = mongoose.model('users', userSch);