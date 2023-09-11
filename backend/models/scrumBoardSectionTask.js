const mongoose = require('mongoose');

const scrumBoardSectionTaskSchema = mongoose.Schema(
    {
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ScrumBoardSection',
            required: true
        },
        title: {
            type: String,
            default: ''
        },
        content: {
            type: String,
            default: ''
        },
        position: {
            type: Number
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        moveHistory: [
            {
                from: {
                    type: String,
                },
                to: {
                    type: String,
                },
                movedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                date: {
                    type: Date,
                    default: new Date(),
                },
            }
        ],
        editHistory: [
            {
                title: {
                    type: String,
                },
                content: {
                    type: String,
                },
                editedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                date: {
                    type: Date,
                    default: new Date(),
                },
            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.scrumBoardSectionTask
    || mongoose.model('scrumBoardSectionTask', scrumBoardSectionTaskSchema);