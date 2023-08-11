const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        details: {
            type: String
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);