const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    SKU: { type: String, required: true },
    additionalCost: { type: Number, required: true },
    stockCount: { type: Number, required: true },
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('variant', variantSchema);