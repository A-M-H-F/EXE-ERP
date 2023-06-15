const router = require('express').Router();
const {
    addNewRole,
    updateRole,
    removeRole,
    getAllRoles,
    getSpecificRole
} = require('../../controllers/role');
const auth = require('../../middleware/auth');

// routes: 5

// @desc    Get all roles
// @route   GET /role
// @access  Private - (authMiddleware, authMiddleware)
router.get('/', auth, getAllRoles);

// @desc    Get specific role
// @route   GET /role/:id
// @access  Private - (authMiddleware, authMiddleware)
router.get('/:id', auth, getSpecificRole);

// @desc    Add New Role
// @route   POST /role
// @access  Private - (authMiddleware, authMiddleware)
router.post('/', auth, addNewRole);

// @desc    Update Role
// @route   PUT /role/:id
// @access  Private - (authMiddleware, authMiddleware)
router.put('/:id', auth, updateRole);

// @desc    Remove Role
// @route   DELETE /role/:id
// @access  Private - (authMiddleware, authMiddleware)
router.delete('/:id', auth, removeRole);

module.exports = router