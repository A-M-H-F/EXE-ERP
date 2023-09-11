const mongoose = require('mongoose');

const customerServiceHistorySchema = mongoose.Schema( // update this to be one collection for each user
    {
        customer: { // full name - address - phone - _id - service
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        serviceHistory: [
            {
                service: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'InternetService'
                },
                changeDate: {
                    type: Date,
                },
                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        createdBy: {
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

module.exports = mongoose.models.CustomerServiceHistory || mongoose.model('CustomerServiceHistory', customerServiceHistorySchema);