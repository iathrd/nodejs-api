const mongoose = require('mongoose');
const {
    string
} = require('@hapi/joi');

const Schema = mongoose.Schema;

const produkSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('produk', produkSchema)