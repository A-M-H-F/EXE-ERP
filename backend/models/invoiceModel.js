const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        products: [
            {
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number
                },
                subTotal: {
                    type: Number
                },
                discount: {
                    type: Number,
                    default: 0
                }
            }
        ],
        services: [
            {
                service: { // panel: isDiscount 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Service'
                },
                quantity: {
                    type: Number,
                    default: 1
                },
                subTotal: { // quantity * service.price
                    type: Number
                },
                discount: { // range
                    type: Number,
                    default: 0 // = 10% price = service.price - (service.price * discount / 100)
                }
            }
        ],
        total: { // products+services(subTotal++)
            type: Number
        },
        qrCode: {
            type: String
        },
        technician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        issuedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        collector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        printedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        paymentStatus: {
            type: String,
            enum: ['paid', 'unpaid'],
            default: 'unpaid'
        },
        paymentDate: {
            type: Date
        },
        serialNumber: {
            type: String,
            unique: true
        },
        status: {
            type: String,
            enum: ['valid', 'cancelled'],
            default: 'valid'
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
