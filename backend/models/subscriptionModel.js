const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema( // update this to be one collection for each user
    {
        customer: { // full name - address - phone
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        service: { // = service
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InternetService'
        },
        qrCode: { // it should include CustomerId
            type: String,
            unique: true
        },
        serialNumber: { // auto generated = customerId+serviceId
            type: String,
            unique: true
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
                serialNumber: {
                    type: String
                },
                addedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);