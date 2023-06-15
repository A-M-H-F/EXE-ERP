const router = require('express').Router();
const {
    getAllSubscriptions,
    getCustomerCurrentSubscription,
    getCustomerSubscriptionHistory,
    getSubscriptionAddedByUser,
    getInternetServiceSubscriptions,
    getSubscriptionByQrCode,
    addNewSubscription,
    changeCustomerSubscriptionService,
    getSpecificSubscription
} = require('../../controllers/subscription');
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

// @desc    Get Customer current subscription
// @route   GET /subscription/customer/:id
// @access  Private - authMiddleware
router.get('/customer/:id', auth, getCustomerCurrentSubscription);

// @desc    Get Customer subscriptions history
// @route   GET /subscription/customer/history/:id
// @access  Private - authMiddleware
router.get('/customer/history/:id', auth, getCustomerSubscriptionHistory);

// @desc    Get User subscriptions
// @route   GET /subscription/user/:id
// @access  Private - authMiddleware
router.get('/user/:id', auth, getSubscriptionAddedByUser);

// @desc    Get Internet Service Subscriptions
// @route   GET /subscription/internet-service/:id
// @access  Private - authMiddleware
router.get('/internet-service/:id', auth, getInternetServiceSubscriptions);

// @desc    Get Subscription by qrCode
// @route   GET /subscription/qr-code
// @access  Private - authMiddleware
router.get('/qr-code', auth, getSubscriptionByQrCode);

// @desc    Add new subscription
// @route   POST /subscription
// @access  Private - authMiddleware
router.post('/', auth, addNewSubscription);

// @desc    change customer subscription service
// @route   PUT /subscription/:id
// @access  Private - authMiddleware
router.put('/:id', auth, changeCustomerSubscriptionService);

module.exports = router;
