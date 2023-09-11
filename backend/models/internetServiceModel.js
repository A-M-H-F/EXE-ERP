const mongoose = require('mongoose');

const internetServiceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        isp: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Isp'
        },
        service: {
            type: String,
            unique: true,
            required: true,
        },
        cost: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        profit: {
            type: Number,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        moreInfo: {
            type: String
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.InternetService || mongoose.model('InternetService', internetServiceSchema);