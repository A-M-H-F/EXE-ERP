const mongoose = require('mongoose');

const customerSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            unique: true,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        additionalPhoneNumbers: [
            {
                type: String
            }
        ],
        address: {
            city: {
                type: String
            },
            zone: {
                type: String
            },
            street: {
                type: String
            },
            building: {
                type: String
            },
            floor: {
                type: String
            },
            apartment: {
                type: String
            }
        },
        coordinates: {
            type: String,
            unique: true
        },
        macAddress: {
            type: String,
            unique: true
        },
        ipAddress: {
            type: String,
            unique: true
        },
        subscriptionDate: {
            type: Date
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

module.exports = mongoose.model('Customer', customerSchema);