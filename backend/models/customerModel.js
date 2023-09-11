const mongoose = require('mongoose');

const customerSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            unique: true,
            required: true
        },
        service: { // = service - _id
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InternetService'
        },
        accountName: {
            type: String,
        },
        arabicName: {
            type: String,
            unique: true,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        moreInfo: {
            type: String
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
            },
            buildingImage: { // to be add for the routes
                type: String,
                default: ''
            },
        },
        coordinates: {
            latitude: {
                type: String,
                // unique: true,
            },
            longitude: {
                type: String,
                // unique: true,
            }
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

module.exports = mongoose.models.Customer || mongoose.model('Customer', customerSchema);