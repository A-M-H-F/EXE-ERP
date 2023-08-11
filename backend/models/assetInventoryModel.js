const mongoose = require('mongoose');

const assetInventorySchema = mongoose.Schema(
    {
        asset: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asset',
            required: true
        },
        cost: {
            type: Number
        },
        serialNumber: {
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
        azimuth: { // compass heading // from 0-359
            type: Number,
        },
        tilt: {  // -15 / +15
            type: Number
        },
        currentStatus: {
            type: String,
            enum: ['New', 'Used', 'Damaged'] // damaged section alone
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        currentLocation: {
            type: String,
        },
        date: {
            type: Date
        },
        locationsHistory: [
            {
                location: {
                    type: String // new - for new items
                },
                date: {
                    type: Date
                }
            }
        ],
        note: {
            type: String
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.AssetInventory || mongoose.model('AssetInventory', assetInventorySchema);