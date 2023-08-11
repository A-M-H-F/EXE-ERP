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

    const result = await Section.find({ board: req.params.id })
        .select('title board')
        .lean();

    if (result) {
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

    const newSections = await Section.find({ board: boardId })
        .select('title board')
        .lean();

    if (result && newSections) {
        res.status(200).json({
            message: 'Section added successfully',
            newSections
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
            message: 'Title updated successfully',
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

    const newSections = await Section.find({ board: isSectionExists.board })
        .select('title board')
        .lean();

    if (deleteTasks && result) {
        res.status(200).json({
            message: 'Section deleted successfully',
            newSections
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