const mongoose = require('mongoose');

const subscriptionInvoiceSchema = mongoose.Schema(
    {
        customer: { // full name - address - phone (client)
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        service: { // = name
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InternetService'
        },
        qrCode: {
            type: String,
            unique: true
        },
        serialNumber: { // auto generated = EX(Year)(month)-(counter) //  counter starting 000001 >
            type: String,
            unique: true
        },
        invoiceDate: {
            type: Date,
        },
        printedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        collector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        paymentStatus: {
            type: String,
            default: 'unPaid',
            enum: ['Paid', 'unPaid']
        },
        paymentDate: {
            type: Date
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SubscriptionInvoice', subscriptionInvoiceSchema);