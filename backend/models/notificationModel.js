const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
    {
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String
        },
        status: {
            type: String,
            enum: ['read', 'unread'],
            default: 'unread'
        },
        date: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);