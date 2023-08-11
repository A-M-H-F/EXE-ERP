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
    addInvoiceByTechnician,
    printInvoice,
    updateInvoiceStatus,
    updateInvoicePaymentStatus
} = require('../../controllers/invoice');
const auth = require('../../middleware/auth');

// routes = 13

// @desc    Get invoices
// @route   GET /invoice
// @access  Private - authMiddleware
router.get('/', auth, getAllInvoices);

// @desc    Get specific invoice info 
// @route   GET /invoice/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificInvoiceInfo);

// @desc    Get Customer invoices
// @route   GET /invoice/customer/:id
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

// @desc    Add new Invoice by office user
// @route   POST /invoice/office
// @access  Private - authMiddleware
router.post('/office', auth, addNewInvoice);

// @desc    Add new Invoice by technician
// @route   POST /invoice/technician
// @access  Private - authMiddleware
router.post('/technician', auth, addInvoiceByTechnician);

// @desc    Print invoice
// @route   PUT /invoice/print/:id
// @access  Private - authMiddleware
router.put('/print/:id', auth, printInvoice);

// @desc    Update Invoice status
// @route   PUT /invoice/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateInvoiceStatus);

// @desc    Update Invoice payment status
// @route   PUT /invoice/payment/:id
// @access  Private - authMiddleware
router.put('/payment/:id', auth, updateInvoicePaymentStatus);

module.exports = router
