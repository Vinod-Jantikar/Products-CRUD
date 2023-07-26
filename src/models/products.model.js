const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    variantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "variant" }]
}, {
    versionKey: false,
    timestamps: true
});

module.exports = mongoose.model('product', productSchema);