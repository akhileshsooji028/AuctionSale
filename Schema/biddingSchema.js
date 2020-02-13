const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const biddingSch = new Schema({
    itemId: {
        type: String
    },
    itemInfo: {},
    userId: {
        type: String
    },
    userInfo: {},
    biddingAmt: {
        type: Number
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('bidding', biddingSch);