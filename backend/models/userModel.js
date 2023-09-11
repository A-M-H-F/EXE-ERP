const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            unique: true,
            required: true
        },
        picture: {
            type: String,
            default: ''
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);