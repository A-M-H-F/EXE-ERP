const router = require('express').Router();
const {
    addNewUser,
    updateUserPassword,
    updateUserName,
    updateUserAdmin,
    updateUserPasswordAdmin,
    updateUserRoleAdmin,
    getAllUsers,
    getSpecificUser,
    getUserInfo,
    updateUserStatus
} = require('../../controllers/user/userCtrls');
const auth = require('../../middleware/auth');

// routes: 10

// @desc    Get user info
// @route   GET /user/info
// @access  Private - authMiddleware
router.get('/info', auth, getUserInfo);

// @desc    Update User Password
// @route   PUT /user/pass
// @access  Private - authMiddleware
router.put('/pass', auth, updateUserPassword);

// @desc    Update User Name
// @route   PUT /user/name
// @access  Private - authMiddleware
router.put('/name', auth, updateUserName);

// @desc    Get All Users
// @route   GET /user
// @access  Private - (authMiddleware, authMiddleware)
router.get('/', auth, getAllUsers);

// @desc    Get Specific user
// @route   GET /user/:id
// @access  Private - (authMiddleware, authMiddleware)
router.get('/:id', auth, getSpecificUser);

// @desc    Add New User
// @route   POST /user
// @access  Private - (authMiddleware, authMiddleware)
router.post('/', auth, addNewUser);

// @desc    Update User (Admin)
// @route   PUT /user/:id
// @access  Private - (authMiddleware, authMiddleware)
router.put('/:id', auth, updateUserAdmin);

// @desc    Update User password (Admin)
// @route   PUT /user/pass/:id
// @access  Private - (authMiddleware, authMiddleware)
router.put('/pass/:id', auth, updateUserPasswordAdmin);

// @desc    Update User role (Admin)
// @route   PUT /user/role/:id
// @access  Private - (authMiddleware, authMiddleware)
router.put('/role/:id', auth, updateUserRoleAdmin);

// @desc    Update user status
// @route   PUT /user/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateUserStatus);

module.exports = router