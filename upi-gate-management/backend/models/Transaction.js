const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    upiId: String,
    amount: Number,
    status: { type: String, enum: ['Success', 'Failed', 'Processing'], default: 'Processing' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
