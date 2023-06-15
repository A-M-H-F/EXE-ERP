const asyncHandler = require('express-async-handler');
const Invoice = require('../../models/invoiceModel');
const Customer = require('../../models/customerModel');
const ProductInventory = require('../../models/productInventoryModel');
const Service = require('../../models/serviceModel');

// @desc    Get invoices
// @route   GET /invoice
// @access  Private - authMiddleware
const getAllInvoices = asyncHandler(async (req, res) => {
    const result = await Invoice.find()
        .populate('customer products.item services.service technician issuedBy printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting invoices');
    }
})

// @desc    Get specific invoice info 
// @route   GET /invoice/:id
// @access  Private - authMiddleware
const getSpecificInvoiceInfo = asyncHandler(async (req, res) => {

})

// @desc    Get Customer invoices
// @route   GET /invoice/customer
// @access  Private - authMiddleware
const getCustomerInvoices = asyncHandler(async (req, res) => {

})

// @desc    Get invoice by QrCode
// @route   GET /invoice/qr-code
// @access  Private - authMiddleware
const getInvoiceByQrCode = asyncHandler(async (req, res) => {

})

// @desc    Get technician invoices
// @route   GET /invoice/technician/:id
// @access  Private - authMiddleware
const getTechnicianInvoices = asyncHandler(async (req, res) => {

})

// @desc    Get invoices printedBy
// @route   GET /invoice/printed-by/:id
// @access  Private - authMiddleware
const getInvoicesPrintedBy = asyncHandler(async (req, res) => {

})

// @desc    Get invoices issuedBy
// @route   GET /invoice/issued-by/:id
// @access  Private - authMiddleware
const getInvoicesIssuedBy = asyncHandler(async (req, res) => {

})

// @desc    Get invoice by payment status
// @route   GET /invoice/payment/:id
// @access  Private - authMiddleware
const getInvoicesByPaymentStatus = asyncHandler(async (req, res) => {

})

// @desc    Add new Invoice
// @route   POST /invoice
// @access  Private - authMiddleware
const addNewInvoice = asyncHandler(async (req, res) => {

})

// @desc    Update Invoice
// @route   PUT /invoice/:id
// @access  Private - authMiddleware
const updateInvoice = asyncHandler(async (req, res) => {

})



// to be continued //



// @desc    Update Invoice
// @route   PUT /invoice/:id
// @access  Private - authMiddleware


module.exports = {
    getAllInvoices,
    getSpecificInvoiceInfo,
    getCustomerInvoices,
    getInvoiceByQrCode,
    getTechnicianInvoices,
    getInvoicesPrintedBy,
    getInvoicesIssuedBy,
    getInvoicesByPaymentStatus,
    addNewInvoice,
    updateInvoice,
}