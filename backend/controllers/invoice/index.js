const asyncHandler = require('express-async-handler');
const Invoice = require('../../models/invoiceModel');
const Customer = require('../../models/customerModel');
const ProductInventory = require('../../models/productInventoryModel');
const Service = require('../../models/serviceModel');
const User = require('../../models/userModel');

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
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Invoice.findById(req.params.id)
        .populate('customer products.item services.service technician issuedBy printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting invoice info');
    }
})

// @desc    Get Customer invoices
// @route   GET /invoice/customer/:id
// @access  Private - authMiddleware
const getCustomerInvoices = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isCustomerExists = await Customer.findById(req.params.id);

    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const result = await Invoice.find(
        {
            customer: isCustomerExists._id
        }
    )
        .populate('products.item services.service technician issuedBy printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting customer invoices');
    }
})

// @desc    Get invoice by QrCode
// @route   GET /invoice/qr-code
// @access  Private - authMiddleware
const getInvoiceByQrCode = asyncHandler(async (req, res) => {
    const { qrCode } = req.body;

    if (!qrCode) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const result = await Invoice.findOne(
        {
            qrCode
        }
    )
        .populate('customer products.item services.service technician issuedBy printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting invoice by qrCode');
    }
})

// @desc    Get technician invoices
// @route   GET /invoice/technician/:id
// @access  Private - authMiddleware
const getTechnicianInvoices = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isUserExists = await User.findById(req.params.id);

    if (!isUserExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await Invoice.find(
        {
            technician: isUserExists._id
        }
    )
        .populate('customer products.item services.service issuedBy printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting technician ${isUserExists.name} invoices`);
    }
})

// @desc    Get invoices printedBy
// @route   GET /invoice/printed-by/:id
// @access  Private - authMiddleware
const getInvoicesPrintedBy = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isUserExists = await User.findById(req.params.id);

    if (!isUserExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await Invoice.find(
        {
            printedBy: isUserExists._id
        }
    )
        .populate('customer products.item services.service technician issuedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting invoices printed by ${isUserExists.name}`)
    }
})

// @desc    Get invoices issuedBy
// @route   GET /invoice/issued-by/:id
// @access  Private - authMiddleware
const getInvoicesIssuedBy = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isUserExists = await User.findById(req.params.id);

    if (!isUserExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await Invoice.find(
        {
            issuedBy
        }
    )
        .populate('customer products.item services.service technician printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting invoices issued by ${isUserExists.name}`);
    }
})

// @desc    Get invoice by payment status
// @route   GET /invoice/payment/:id
// @access  Private - authMiddleware
const getInvoicesByPaymentStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || !['paid', 'unpaid'].includes(req.params.id)) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Invoice.find(
        {
            paymentStatus: req.params.id
        }
    )
        .populate('customer products.item services.service technician printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting ${req.params.id} invoices`);
    }
})

// @desc    Add new Invoice by office user
// @route   POST /invoice/office
// @access  Private - authMiddleware
const addNewInvoice = asyncHandler(async (req, res) => {
    const {
        customer,
        products,
        services,
        total,
        technician
    } = req.body;

    if (!customer || !technician || !issuedBy || !total) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (products.length <= 0 && services.length <= 0) {
        res.status(400);
        throw new Error('Please add at least one product or service, and try again');
    }

    const isCustomerExists = await Customer.findById(customer);
    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const isTechnicianExists = await User.findById(technician);
    if (!isTechnicianExists) {
        res.status(400);
        throw new Error('Technician not found');
    }

    const result = await new Invoice(
        {
            customer: isCustomerExists._id,
            products,
            services,
            total,
            technician: isTechnicianExists._id,
            issuedBy: req.user.id
        }
    );

    const getLastInvoice = await invoice.findOne({})
        .sort({ createdAt: -1 }).limit(1);

    let lastSerialNumber;
    let lastCounter;
    if (getLastInvoice) {
        lastSerialNumber = getLastSubscriptionInvoice.serialNumber;
        lastCounter = parseInt(lastSerialNumber.substring(7));
    } else {
        lastCounter = `000001`;
    }

    // to be checked
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Add 1 because getMonth returns a zero-based index
    const counter = lastCounter + 1;  // counter: starting 000001
    const serialNumber = `Ex${year}${month.toString().padStart(2, '0')}-${counter.toString().padStart(6, '0')}`;

    result.serialNumber = serialNumber;
    result.qrCode = `${process.env.CLIENT_URL}/invoice/${result._id}`;

    const saveInvoice = await result.save();

    if (saveInvoice) {
        res.status(200).json(result._id);
    } else {
        res.status(400);
        throw new Error('Error adding new invoice');
    }
})

// @desc    Add new Invoice by technician
// @route   POST /invoice/technician
// @access  Private - authMiddleware
const addInvoiceByTechnician = asyncHandler(async (req, res) => {
    const {
        customer,
        products,
        services,
        total
    } = req.body;

    if (!customer || !total || !issuedBy) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (products.length <= 0 && services.length <= 0) {
        res.status(400);
        throw new Error('Please add at least one product or service, and try again');
    }

    const isCustomerExists = await Customer.findById(customer);
    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const result = await new Invoice(
        {
            customer: isCustomerExists._id,
            products,
            services,
            total,
            technician: req.user.id,
            issuedBy: req.user.id
        }
    );

    const getLastInvoice = await Invoice.findOne({})
        .sort({ createdAt: -1 }).limit(1);

    let lastSerialNumber;
    let lastCounter;
    if (getLastInvoice) {
        lastSerialNumber = getLastSubscriptionInvoice.serialNumber;
        lastCounter = parseInt(lastSerialNumber.substring(7));
    } else {
        lastCounter = `000001`;
    }

    // to be checked
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Add 1 because getMonth returns a zero-based index
    const counter = lastCounter + 1;  // counter: starting 000001
    const serialNumber = `Ex${year}${month.toString().padStart(2, '0')}-${counter.toString().padStart(6, '0')}`;

    result.serialNumber = serialNumber;
    result.qrCode = `${process.env.CLIENT_URL}/invoice/${result._id}`;

    const saveInvoice = await result.save();

    if (saveInvoice) {
        res.status(200).json(result._id);
    } else {
        res.status(400);
        throw new Error('Error adding new invoice');
    }
})

// @desc    Print invoice
// @route   PUT /invoice/print/:id
// @access  Private - authMiddleware
const printInvoice = asyncHandler(async (req, res) => {
    const { toBeCollectedNow } = req.body;

    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    if (!toBeCollectedNow) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isInvoiceExists = await Invoice.findById(req.params.id);
    if (!isInvoiceExists) {
        res.status(400);
        throw new Error('Invoice not found');
    }

    const result = {
        $set: {
            printedBy: req.user.id,
        }
    };

    if (toBeCollectedNow) {
        result.$set.collector = req.user.id;
        result.$set.paymentStatus = 'paid';
        result.$set.paymentDate = new Date();
    }

    const updateToPrint = await Invoice.findByIdAndUpdate(isInvoiceExists._id, result);

    if (updateToPrint) {
        res.status(200).json({ message: 'Ready to be printed' });
    } else {
        res.status(400);
        throw new Error('Error, try again');
    }
})

// @desc    Update Invoice status
// @route   PUT /invoice/status/:id
// @access  Private - authMiddleware
const updateInvoiceStatus = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, Try again');
    }

    const isInvoiceExists = await Invoice.findById(req.params.id).lean();
    if (!isInvoiceExists) {
        res.status(400);
        throw new Error('Invoice not found');
    }

    const statusCondition = isInvoiceExists.status === 'valid' ? 'cancelled' : 'valid';

    const result = await Invoice.findByIdAndUpdate(
        isInvoiceExists._id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (result) {
        res.status(200).json({ message: `Invoice status updated to ${statusCondition}` });
    } else {
        res.status(400);
        throw new Error('Error updating invoice status');
    }
})

// @desc    Update Invoice payment status
// @route   PUT /invoice/payment/:id
// @access  Private - authMiddleware
const updateInvoicePaymentStatus = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isInvoiceExists = await Invoice.findById(req.params.id).lean();
    if (!isInvoiceExists) {
        res.status(400);
        throw new Error('Invoice not found');
    }

    if (isInvoiceExists.paymentStatus === 'paid') {
        res.status(400);
        throw new Error('Invoice already paid');
    }

    const result = await Invoice.findByIdAndUpdate(
        isInvoiceExists._id,
        {
            $set: {
                paymentStatus: 'paid',
                paymentDate: new Date(),
                collector: req.user.id
            }
        }
    );

    if (result) {
        res.status(200).json({ message: 'Invoice payment status updated to paid' });
    } else {
        res.status(400);
        throw new Error('Error updating invoice status');
    }
})

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
    addInvoiceByTechnician,
    printInvoice,
    updateInvoiceStatus,
    updateInvoicePaymentStatus
}