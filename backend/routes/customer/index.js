const router = require('express').Router();
const {
    getAllCustomers,
    getActiveCustomers,
    getInActiveCustomers,
    getSpecificCustomer,
    addNewCustomer,
    updateCustomer,
    updateCustomerStatus
} = require('../../controllers/customer');
const auth = require('../../middleware/auth');

// routes: 7

// @desc    Get all customers
// @route   GET /customer
// @access  Private - authMiddleware
router.get('/', auth, getAllCustomers);

// @desc    Get all active customers
// @route   GET /customer/active
// @access  Private - authMiddleware
router.get('/active', auth, getActiveCustomers);

// @desc    Get all inactive customers
// @route   GET /customer/inactive
// @access  Private - authMiddleware
router.get('/inactive', auth, getInActiveCustomers);

// @desc    Get specific customer
// @route   GET /customer/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificCustomer);

// @desc    Add new customer
// @route   POST /customer
// @access  Private - authMiddleware
router.post('/', auth, addNewCustomer);

// @desc    Update Customer
// @route   PUT /customer/:id
// @access  Private - authMiddleware
router.put('/:id', auth, updateCustomer);

// @desc    Activate/Deactivate Customer
// @route   PUT /customer/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateCustomerStatus);

module.exports = router