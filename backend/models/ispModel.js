const mongoose = require('mongoose');

const ispSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        address: {
            type: String,
            unique: true
        },
        phoneNumbers: [
            {
                type: String,
                unique: true
            }
        ],
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

module.exports = mongoose.model('Isp', ispSchema);