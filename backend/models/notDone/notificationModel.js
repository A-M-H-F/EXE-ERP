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
        date: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', notificationSchema);