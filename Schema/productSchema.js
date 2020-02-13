const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSch = new Schema({
    productName: {
        type: String
    },
    description: {
        type: String
    },
    startingPrice: {
        type: Number
    },
    startingTime: {
        type: Date,
        default: Date.now()
    },
    endingTime: {
        type: String
    },
    winner: {},
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    productImage: {
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('products', productSch);