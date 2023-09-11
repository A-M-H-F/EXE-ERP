const router = require('express').Router();
const { uploadProfilePictureStorage, uploadUserProfilePicStorage } = require('../../config/storage');
const { uploadNewUserProfilePicStorage } = require('../../config/storage/newUserProfilePic');
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
    updateUserStatus,
    uploadProfilePicture,
    getAllUsersForSelection,
    uploadProfilePictureAdmin,
    handleNewUserPic
} = require('../../controllers/user');
const auth = require('../../middleware/auth');

// routes: 13

// @desc    Get user info
// @route   GET /user/info
// @access  Private - authMiddleware
router.get('/info', auth, getUserInfo);

// @desc    Update User Password
// @route   PUT /user/pass
// @access  Private - authMiddleware
router.put('/pass', auth, updateUserPassword);

// @desc    Update User Name
// @route   PUT /user/username
// @access  Private - authMiddleware
router.put('/username', auth, updateUserName);

// @desc    Get All Users
// @route   GET /user
// @access  Private - (authMiddleware, authMiddleware)
router.get('/', auth, getAllUsers);

// @desc    Get All Users (name - _id) only
// @route   GET /user/selection
// @access  Private - authMiddleware
router.get('/selection', auth, getAllUsersForSelection);

// @desc    Get Specific user
// @route   GET /user/:id
// @access  Private - (authMiddleware, authMiddleware)
router.get('/:id', auth, getSpecificUser);

// @desc    Add New User
// @route   POST /user
// @access  Private - (authMiddleware, authMiddleware)
router.post(
    '/',
    auth,
    addNewUser,
    uploadNewUserProfilePicStorage.single('image'),
    handleNewUserPic,
);

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

// @desc    Upload profile picture
// @route   PUT /user/profile/picture
// @access  Private - authMiddleware
router.put('/profile/picture', auth, uploadProfilePictureStorage.single('image'), uploadProfilePicture);

// @desc    Upload profile picture admin
// @route   PUT /user/picture/:id
// @access  Private - authMiddleware
router.put('/picture/:id', auth, uploadUserProfilePicStorage.single('image'), uploadProfilePictureAdmin);

module.exports = router