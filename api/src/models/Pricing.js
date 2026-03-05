const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    features: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pricing', PricingSchema);