const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide amount'],
        min: [0, 'Amount cannot be negative']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    category: {
        type: String,
        enum: ['sales', 'investment', 'service', 'other'],
        default: 'sales'
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true
});

// Index for faster queries
profitSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Profit', profitSchema);