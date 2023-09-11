const mongoose = require('mongoose');

const addressSchema = mongoose.Schema(
    {
        city: {
            type: String,
            unique: true
        },
        zones: [
            {
                name: {
                    type: String
                },
                streets: [
                    {
                        name: {
                            type: String,
                            required: true,
                        },
                    },
                ]
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
)

module.exports = mongoose.models.Address || mongoose.model('Address', addressSchema);