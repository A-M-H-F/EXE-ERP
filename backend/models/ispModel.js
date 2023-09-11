const mongoose = require('mongoose');

const ispSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        code: {
            type: Number,
            unique: true, 
        },
        address: {
            type: String,
            unique: true
        },
        contactInfo: {
            type: String,
            unique: true
        },
        phoneNumbers: [
            {
                type: String
            }
        ],
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
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

module.exports = mongoose.models.Isp || mongoose.model('Isp', ispSchema);