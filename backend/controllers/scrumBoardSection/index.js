const asyncHandler = require('express-async-handler');
const Board = require('../../models/scrumBoard');
const Section = require('../../models/scrumBoardSection');
const Task = require('../../models/scrumBoardSectionTask');

// @desc    Get All Sections
// @route   GET /boards/sections/:id
// @access  Private - authMiddleware
const getAllSections = asyncHandler(async (req, res) => {
    const isBoardExists = await Board.findById(req.params.id);

    if (!isBoardExists) {
        res.status(400);
        throw new Error('Board not found');
    }

    const result = await Section.find({ board: req.params.id }).sort({ position: 1 }).lean()
        .select('title board')
        .lean();

    const getTasks = await Promise.all(result.map(async (section) => {
        const tasks = await Task.find({ section: section._id })
            .sort({ position: 1 })
            .populate({
                path: 'moveHistory.movedBy',
                select: 'name _id'
            })
            .populate({
                path: 'creator',
                select: 'name _id'
            })
            .populate({
                path: 'updatedBy',
                select: 'name _id'
            })
            .populate({
                path: 'editHistory.editedBy',
                select: 'name _id'
            })
            .lean()
        section.tasks = tasks
    }))

    if (result && getTasks) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting board sections');
    }
})

// @desc    Create new section
// @route   POST /boards/sections/:id
// @access  Private - authMiddleware
const createSection = asyncHandler(async (req, res) => {
    const boardId = req.params.id;

    const { title } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Please add a section title');
    }

    const isBoardExists = await Board.findById(boardId);

    if (!isBoardExists) {
        res.status(400);
        throw new Error('Board not found');
    }

    const result = await Section.create({
        title,
        board: boardId
    })

    if (result) {
        const section = {
            _id: String(result._id),
            title: result.title,
            board: String(result.board),
            tasks: []
        }

        res.status(200).json({
            message: 'Section added successfully',
            section
        });
    } else {
        res.status(400);
        throw new Error('Error adding a new section');
    }
})

// @desc    Update Section Title
// @route   PUT /boards/sections/title/:id
// @access  Private - authMiddleware
const updateSectionTitle = asyncHandler(async (req, res) => {
    const sectionId = req.params.id;
    const { title } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Please add a section title');
    }

    const isSectionExists = await Section.findById(sectionId);

    if (!isSectionExists) {
        res.status(400);
        throw new Error('Section not found');
    }

    const result = await Section.findByIdAndUpdate(
        sectionId,
        {
            $set: {
                title
            }
        }
    )

    if (result) {
        res.status(200).json({
            message: 'Title updated successfully'
        });
    } else {
        res.status(400);
        throw new Error('Error updating title');
    }
})

// @desc    Delete section
// @route   DELETE /boards/sections/:id
// @access  Private - authMiddleware
const deleteSection = asyncHandler(async (req, res) => {
    const sectionId = req.params.id;

    const isSectionExists = await Section.findById(sectionId);

    if (!isSectionExists) {
        res.status(400);
        throw new Error('Section not found');
    }

    const checkCreator = await Board.findById(isSectionExists.board);

    if (String(checkCreator.creator) !== String(req.user.id)) {
        res.status(400);
        throw new Error('Not the creator');
    }

    const deleteTasks = await Task.deleteMany({ section: sectionId });
    const result = await Section.findByIdAndDelete(sectionId);

    if (deleteTasks && result) {
        res.status(200).json({
            message: 'Section deleted successfully'
        })
    } else {
        res.status(400);
        throw new Error('Error deleting section')
    }
})

module.exports = {
    getAllSections,
    createSection,
    updateSectionTitle,
    deleteSection
}