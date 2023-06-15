const mongoose = require('mongoose');

const productInventorySchema = mongoose.Schema( // to be checked (isBox - Box)...
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        serialNumber: {
            type: String,
            required: true,
            unique: true
        },
        modelNumber: {
            type: String
        },
        price: {
            type: Number
        },
        cost: {
            type: Number
        },
        quantity: {
            type: Number
        },
        boxes: {
            type: Number
        },
        status: {
            type: String,
            enum: ['new', 'used', 'damaged'],
            required: true
        },
        description: {
            type: String
        },
        notes: {
            type: String
        },
        isBox: {
            type: Boolean,
            enum: [true, false],
            default: 'false'
        },
        box: {
            quantityPerBox: { // 60m or 20 sxt
                type: Number
            },
            costPerOne: { // cost / boxQuantity 
                type: Number
            },
            pricePerOne: {
                type: Number
            },
            serialNumber: [  // serialNumber.length = quantity
                {
                    type: String
                }
            ]
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ProductInventory', productInventorySchema);