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
        }
    }
)

module.exports = mongoose.model('Address', addressSchema);