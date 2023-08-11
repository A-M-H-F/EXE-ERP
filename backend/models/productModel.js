const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        brand: {
            type: String
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
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

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);