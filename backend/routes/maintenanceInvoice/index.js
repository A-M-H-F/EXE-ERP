const router = require('express').Router();
const { 
    getAllMaintenanceInvoices, 
    getSpecificMaintenanceInvoiceInfo, 
    getCustomerMaintenanceInvoices,
    getMaintenanceInvoiceByQrCode,
    getMaintenanceTechnicianInvoices,
    getMaintenanceInvoicesPrintedBy,
    getMaintenanceInvoicesIssuedBy,
    getMaintenanceInvoicesByPaymentStatus,
    addNewMaintenanceInvoice,
    addMaintenanceInvoiceByTechnician,
    printMaintenanceInvoice,
    updateMaintenanceInvoiceStatus,
    updateMaintenanceInvoicePaymentStatus
} = require('../../controllers/maintenanceInvoice');
const auth = require('../../middleware/auth');

// routes = 13

// @desc    Get maintenance invoices
// @route   GET /maintenance-invoice
// @access  Private - authMiddleware
router.get('/', auth, getAllMaintenanceInvoices);

// @desc    Get specific maintenance invoice info 
// @route   GET /maintenance-invoice/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificMaintenanceInvoiceInfo);

// @desc    Get Customer maintenance invoices
// @route   GET /maintenance-invoice/customer/:id
// @access  Private - authMiddleware
router.get('/customer/:id', auth, getCustomerMaintenanceInvoices);

// @desc    Get maintenance invoice by QrCode
// @route   GET /maintenance-invoice/qr-code
// @access  Private - authMiddleware
router.get('/qr-code', auth, getMaintenanceInvoiceByQrCode);

// @desc    Get technician maintenance invoices
// @route   GET /maintenance-invoice/technician/:id
// @access  Private - authMiddleware
router.get('/technician/:id', auth, getMaintenanceTechnicianInvoices);

// @desc    Get invoices maintenance printedBy
// @route   GET /maintenance-invoice/printed-by/:id
// @access  Private - authMiddleware
router.get('/printed-by/:id', auth, getMaintenanceInvoicesPrintedBy);

// @desc    Get maintenance invoices issuedBy
// @route   GET /invoice/issued-by/:id
// @access  Private - authMiddleware
router.get('/issued-by/:id', auth, getMaintenanceInvoicesIssuedBy);

// @desc    Get maintenance invoice by payment status
// @route   GET /maintenance-invoice/payment/:id
// @access  Private - authMiddleware
router.get('/payment/:id', auth, getMaintenanceInvoicesByPaymentStatus);

// @desc    Add new Maintenance Invoice by office user
// @route   POST /invoice/office
// @access  Private - authMiddleware
router.post('/office', auth, addNewMaintenanceInvoice);

// @desc    Add new Maintenance Invoice by technician
// @route   POST /maintenance-invoice/technician
// @access  Private - authMiddleware
router.post('/technician', auth, addMaintenanceInvoiceByTechnician);

// @desc    Print maintenance invoice
// @route   PUT /maintenance-invoice/print/:id
// @access  Private - authMiddleware
router.put('/print/:id', auth, printMaintenanceInvoice);

// @desc    Update Maintenance Invoice status
// @route   PUT /maintenance-invoice/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateMaintenanceInvoiceStatus);

// @desc    Update Maintenance Invoice payment status
// @route   PUT /maintenance-invoice/payment/:id
// @access  Private - authMiddleware
router.put('/payment/:id', auth, updateMaintenanceInvoicePaymentStatus);

module.exports = router
