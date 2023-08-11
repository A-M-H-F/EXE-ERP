const mongoose = require('mongoose');

const scrumBoardSectionSchema = mongoose.Schema(
    {
        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ScrumBoard',
            required: true
        },
        title: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.models.ScrumBoardSection || mongoose.model('ScrumBoardSection', scrumBoardSectionSchema);