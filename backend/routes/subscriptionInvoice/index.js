const router = require('express').Router();
const {
    getAllSubscriptionInvoices,
    getSpecificSubscriptionInvoice,
    getCustomerSubscriptionInvoices,
    addNewSubscriptionInvoice,
    printSubscriptionInvoice,
    collectSubscriptionInvoice,
    getSubscriptionInvoicePrintHistory,
} = require('../../controllers/subscriptionInvoice');
const auth = require('../../middleware/auth');

// routes: 7

// @desc    Get All Subscription Invoices
// @route   GET /subscription-invoice
// @access  Private - authMiddleware
router.get('/', auth, getAllSubscriptionInvoices);

// @desc    Get Specific Subscription Invoice info (helper)
// @route   GET /subscription-invoice/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificSubscriptionInvoice);

// @desc    Get Customer subscription invoices
// @route   GET /subscription-invoice/customer/:id
// @access  Private - authMiddleware
router.get('/customer/:id', auth, getCustomerSubscriptionInvoices);

// @desc    Get Subscription Invoice print history
// @route   GET /subscription-invoice/history/:id
// @access  Private - authMiddleware
router.get('/history/:id', auth, getSubscriptionInvoicePrintHistory);

// @desc    Add new subscription invoice
// @route   POST /subscription-invoice
// @access  Private - authMiddleware
router.post('/', auth, addNewSubscriptionInvoice);

// @desc    Print subscription invoice
// @route   PUT /subscription-invoice/print/:id
// @access  Private - authMiddleware
router.put('/print/:id', auth, printSubscriptionInvoice);

// @desc    Collect subscription invoice
// @route   PUT /subscription-invoice/collect/:id
// @access  Private - authMiddleware
router.put('/collect/:id', auth, collectSubscriptionInvoice);

module.exports = router;
