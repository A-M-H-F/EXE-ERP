const mongoose = require('mongoose');

const subscriptionInvoiceSchema = mongoose.Schema(
    {
        customer: { // full name - address - phone (client) - service(name)
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        service: {
            ref: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'InternetService'
            },
            service: {
                type: String,
            },
            name: {
                type: String,
            },
            price: {
                type: Number,
            },
            cost: {
                type: Number,
            },
            accountNumber: {
                type: Number,
            }
        },
        serialNumber: { // auto generated = EX(Year)(month)-(counter) //  counter starting 000001 >
            type: String,
            unique: true
        },
        invoiceMonth: {
            type: String,
        },
        invoiceDate: {
            type: Date,
        },
        collector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        paymentStatus: {
            type: String,
            default: 'unPaid',
            enum: ['paid', 'unPaid']
        },
        paymentDate: {
            type: Date
        },
        printDate: {
            type: Date
        },
        printedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        printHistory: [
            {
                printedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                printDate: {
                    type: Date
                },
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.SubscriptionInvoice || mongoose.model('SubscriptionInvoice', subscriptionInvoiceSchema);