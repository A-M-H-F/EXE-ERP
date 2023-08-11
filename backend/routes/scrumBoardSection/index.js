const router = require('express').Router();
const {
    getAllSections,
    createSection,
    updateSectionTitle,
    deleteSection
} = require('../../controllers/scrumBoardSection');
const auth = require('../../middleware/auth');

// @desc    Get All Sections
// @route   GET /boards/sections/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getAllSections);

// @desc    Create new section
// @route   POST /boards/sections/:id
// @access  Private - authMiddleware
router.post('/:id', auth, createSection);

// @desc    Update Section Title
// @route   PUT /boards/sections/title/:id
// @access  Private - authMiddleware
router.put('/title/:id', auth, updateSectionTitle);

// @desc    Delete section
// @route   DELETE /boards/sections/:id
// @access  Private - authMiddleware
router.delete('/:id', auth, deleteSection);

module.exports = router;
