const mongoose = require('mongoose');

const internetServiceSchema = mongoose.Schema(
    {
        name: {
            type: String
        },
        isp: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Isp'
        },
        service: {
            type: String,
            unique: true
        },
        cost: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        moreInfo: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.InternetService || mongoose.model('InternetService', internetServiceSchema);