const mongoose = require('mongoose');

const scrumBoardSchema = mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        users: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                favorite: {
                    type: Boolean,
                    default: false
                },
                favoritePosition: {
                    type: Number,
                    default: 0
                },
                position: {
                    type: Number
                },
            }
        ],
        icon: {
            type: String,
            default: 'GoHash'
        },
        title: {
            type: String,
            default: 'Untitled'
        },
        description: {
            type: String,
            default: 'Add description here'
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.ScrumBoard || mongoose.model('ScrumBoard', scrumBoardSchema);