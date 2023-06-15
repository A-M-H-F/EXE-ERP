const router = require('express').Router();
const {
    getAllSubscriptionInvoices,
    getSpecificSubscriptionInvoice,
    getCustomerSubscriptionInvoices,
    getSubscriptionInvoicesByIS,
    getSubscriptionInvoiceByQrCode,
    getSubscriptionInvoicesByPaymentStatus,
    getSubscriptionInvoiceByRangeOfDate,
    getSubscriptionInvoiceByCollector,
    getSubscriptionInvoicePrintedBy,
    getSubscriptionInvoiceBySerialNumber,
    addNewSubscriptionInvoice,
    printSubscriptionInvoice,
    collectSubscriptionInvoice,
    getSubscriptionInvoiceForCurrentMonth
} = require('../../controllers/subscriptionInvoice');
const auth = require('../../middleware/auth');

// routes: 14

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

// @desc    Get Internet service subscription invoices
// @route   GET /subscription-invoice/internet-service/:id
// @access  Private - authMiddleware
router.get('/internet-service/:id', auth, getSubscriptionInvoicesByIS);

// @desc    Get subscription invoice by qrCode
// @route   GET /subscription-invoice/qr-code
// @access  Private - authMiddleware
router.get('/qr-code', auth, getSubscriptionInvoiceByQrCode);

// @desc    Get subscription invoices by paymentStatus (paid-unpaid)
// @route   GET /subscription-invoice/status/:id
// @access  Private - authMiddleware
router.get('/status/:id', auth, getSubscriptionInvoicesByPaymentStatus);

// @desc    Get subscription invoices for this month
// @route   GET /subscription-invoice/month
// @access  Private - authMiddleware
router.get('/month', auth, getSubscriptionInvoiceForCurrentMonth);

// @desc    Get subscription invoices for a specific range of date
// @route   GET /subscription-invoice/date
// @access  Private - authMiddleware
router.get('/date', auth, getSubscriptionInvoiceByRangeOfDate);

// @desc    Get subscription invoices by collector
// @route   GET /subscription-invoice/collector/:id
// @access  Private - authMiddleware
router.get('/collector/:id', auth, getSubscriptionInvoiceByCollector);

// @desc    Get subscription invoices printedBy a user
// @route   GET /subscription-invoice/printed-by/:id
// @access  Private - authMiddleware
router.get('/printed-by/:id', auth, getSubscriptionInvoicePrintedBy);

// @desc    Get subscription invoice by serialNumber
// @route   GET /subscription-invoice/serial/:id
// @access  Private - authMiddleware
router.get('/serial/:id', auth, getSubscriptionInvoiceBySerialNumber);

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
