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
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.scrumBoardSectionTask
    || mongoose.model('scrumBoardSectionTask', scrumBoardSectionTaskSchema);