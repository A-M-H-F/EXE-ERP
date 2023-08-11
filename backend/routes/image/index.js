const router = require('express').Router()
const { getProfilePicture, getUsersProfilePictures } = require('../../controllers/image');
const auth = require('../../middleware/auth');
const webImageLimiter = require('../../requestLimiters/webImageLimiter');

// @desc    Get profile picture
// @route   GET /images/profile/picture
// @access  Private - authMiddleware
router.get('/profile/picture', webImageLimiter, auth, getProfilePicture);

// @desc    Get users profile pictures
// @route   GET /images/profiles
// @access  Private - authMiddleware
router.get('/profiles', webImageLimiter, auth, getUsersProfilePictures);

module.exports = router