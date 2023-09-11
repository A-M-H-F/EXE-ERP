const router = require('express').Router();
const {
    getAllInternetServices,
    getSpecificIS,
    addNewInternetService,
    updateInternetService,
    updateInternetServiceStatus,
    updateInternetServiceISP,
    getActiveInternetServices
} = require('../../controllers/internetService');
const auth = require('../../middleware/auth');

// routes: 7

// @desc    Get All internet services
// @route   GET /internet-service
// @access  Private - authMiddleware
router.get('/', auth, getAllInternetServices);

// @desc    Get All active internet services
// @route   GET /internet-service/active
// @access  Private - authMiddleware
router.get('/active', auth, getActiveInternetServices);

// @desc    Get specific internet service
// @route   GET /internet-service/:id
// @access  Private - (authMiddleware, authMiddleware)
router.get('/:id', auth, getSpecificIS);

// @desc    Add new internet service
// @route   POST /internet-service/add
// @access  Private - (authMiddleware, authMiddleware)
router.post('/', auth, addNewInternetService);

// @desc    Update  internet service
// @route   PUT /internet-service/:id
// @access  Private - (authMiddleware, authMiddleware)
router.put('/:id', auth, updateInternetService);

// @desc    Update  internet service
// @route   PUT /internet-service/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateInternetServiceStatus);

// @desc    Update internet service isp
// @route   PUT /internet-service/isp/:id
// @access  Private - authMiddleware
router.put('/isp/:id', auth, updateInternetServiceISP);

module.exports = router