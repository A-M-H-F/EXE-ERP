const router = require('express').Router();
const {
    getAllSubscriptions,
    getSpecificSubscription
} = require('../../controllers/subscriptionHistory');
const auth = require('../../middleware/auth');

// routes: 7

// @desc    Get All Subscriptions
// @route   GET /subscription
// @access  Private - authMiddleware
router.get('/', auth, getAllSubscriptions);

// @desc    Get Specific Subscription info (helper)
// @route   GET /subscription/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificSubscription);

module.exports = router;
