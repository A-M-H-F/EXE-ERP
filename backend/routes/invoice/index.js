const router = require('express').Router();
const {
    getAllInvoices,
    getSpecificInvoiceInfo, 
    getCustomerInvoices,
    getInvoiceByQrCode,
    getTechnicianInvoices,
    getInvoicesPrintedBy,
    getInvoicesIssuedBy,
    getInvoicesByPaymentStatus,
    addNewInvoice,
    updateInvoice
} = require('../../controllers/invoice');
const auth = require('../../middleware/auth');

// routes = 9

// @desc    Get invoices
// @route   GET /invoice
// @access  Private - authMiddleware
router.get('/', auth, getAllInvoices);

// @desc    Get specific invoice info 
// @route   GET /invoice/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificInvoiceInfo);

// @desc    Get Customer invoices
// @route   GET /invoice/customer
// @access  Private - authMiddleware
router.get('/customer/:id', auth, getCustomerInvoices);

// @desc    Get invoice by QrCode
// @route   GET /invoice/qr-code
// @access  Private - authMiddleware
router.get('/qr-code', auth, getInvoiceByQrCode);

// @desc    Get technician invoices
// @route   GET /invoice/technician/:id
// @access  Private - authMiddleware
router.get('/technician/:id', auth, getTechnicianInvoices);

// @desc    Get invoices printedBy
// @route   GET /invoice/printed-by/:id
// @access  Private - authMiddleware
router.get('/printed-by/:id', auth, getInvoicesPrintedBy);

// @desc    Get invoices issuedBy
// @route   GET /invoice/issued-by/:id
// @access  Private - authMiddleware
router.get('/issued-by/:id', auth, getInvoicesIssuedBy);

// @desc    Get invoice by payment status
// @route   GET /invoice/payment/:id
// @access  Private - authMiddleware
router.get('/payment/:id', auth, getInvoicesByPaymentStatus);

// @desc    Add new Invoice
// @route   POST /invoice
// @access  Private - authMiddleware
router.post('/', auth, addNewInvoice);

// @desc    Update Invoice
// @route   PUT /invoice/:id
// @access  Private - authMiddleware
router.put('/:id', auth, updateInvoice);

module.exports = router
