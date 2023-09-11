const router = require('express').Router();
const { updateCustomerBPicStorage } = require('../../config/storage/customerBPic');
const { uploadNewCustomerBuildingPicStorage } = require('../../config/storage/newCustomerBPic');
const {
    getAllCustomers,
    getSpecificCustomer,
    addNewCustomer,
    updateCustomer,
    updateCustomerStatus,
    handleNewCustomerBPic,
    updateCustomerBuildingImage,
    getActiveCustomers,
    changeCustomerSubscriptionService
} = require('../../controllers/customer');
const auth = require('../../middleware/auth');

// routes: 9

// @desc    Get all customers
// @route   GET /customer
// @access  Private - authMiddleware
router.get('/', auth, getAllCustomers);

// @desc    Get active customers
// @route   GET /customer/active
// @access  Private - authMiddleware
router.get('/active', auth, getActiveCustomers);

// @desc    Get specific customer
// @route   GET /customer/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificCustomer);

// @desc    Add new customer
// @route   POST /customer
// @access  Private - authMiddleware
router.post(
    '/',
    auth,
    addNewCustomer,
    uploadNewCustomerBuildingPicStorage.single('image'),
    handleNewCustomerBPic,
);

// @desc    Update Customer
// @route   PUT /customer/:id
// @access  Private - authMiddleware
router.put('/:id', auth, updateCustomer);

// @desc    Activate/Deactivate Customer
// @route   PUT /customer/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateCustomerStatus);

// @desc    Change customer subscription service
// @route   PUT /customer/subscription/:id
// @access  Private - authMiddleware
router.put('/subscription/:id', auth, changeCustomerSubscriptionService);

// @desc    Upload customer building image
// @route   PUT /customer/building/image/:id
// @access  Private - authMiddleware
router.put('/building/image/:id', auth, updateCustomerBPicStorage.single('image'), updateCustomerBuildingImage);

module.exports = router