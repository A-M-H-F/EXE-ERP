const router = require('express').Router();
const {
    authLogin,
    getAccessToken,
    authLogout
} = require('../../controllers/auth');
const authRequestLimiter = require('../../requestLimiters/authRequestLimiter');
const auth = require('../../middleware/auth');

// routes: 3

// @desc    Web 2.0 Login
// @route   POST /auth/login
// @access  Public
router.post('/login', authRequestLimiter, authLogin);

// @desc    Get Access Token
// @route   POST /auth/extreme-ref
// @access  Private - authMiddleware
router.post('/extreme-ref', authRequestLimiter, getAccessToken); // add auth middleware

// @desc    Logout
// @route   POST /auth/logout
// @access  Private - authMiddleware / authAdmin
router.get('/logout', authRequestLimiter, auth, authLogout);

module.exports = router
