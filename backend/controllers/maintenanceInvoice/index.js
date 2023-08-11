const asyncHandler = require('express-async-handler');
const MaintenanceInvoice = require('../../models/maintenanceInvoiceModel');
const Customer = require('../../models/customerModel');
const ProductInventory = require('../../models/productInventoryModel');
const Service = require('../../models/serviceModel');
const User = require('../../models/userModel');

// @desc    Get maintenance invoices
// @route   GET /maintenance-invoice
// @access  Private - authMiddleware
const getAllMaintenanceInvoices = asyncHandler(async (req, res) => {
    const result = await MaintenanceInvoice.find()
        .populate('customer products.item services.service technician issuedBy printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting maintenance invoices');
    }
})

// @desc    Get specific maintenance invoice info 
// @route   GET /maintenance-invoice/:id
// @access  Private - authMiddleware
const getSpecificMaintenanceInvoiceInfo = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await MaintenanceInvoice.findById(req.params.id)
        .populate('customer products.item services.service technician issuedBy printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting maintenance invoice info');
    }
})

// @desc    Get Customer maintenance invoices
// @route   GET /maintenance-invoice/customer/:id
// @access  Private - authMiddleware
const getCustomerMaintenanceInvoices = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isCustomerExists = await Customer.findById(req.params.id);

    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const result = await MaintenanceInvoice.find(
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
        throw new Error('Error getting customer maintenance invoices');
    }
})

// @desc    Get maintenance invoice by QrCode
// @route   GET /maintenance-invoice/qr-code
// @access  Private - authMiddleware
const getMaintenanceInvoiceByQrCode = asyncHandler(async (req, res) => {
    const { qrCode } = req.body;

    if (!qrCode) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const result = await MaintenanceInvoice.findOne(
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
        throw new Error('Error getting maintenance invoice by qrCode');
    }
})

// @desc    Get technician maintenance invoices
// @route   GET /maintenance-invoice/technician/:id
// @access  Private - authMiddleware
const getMaintenanceTechnicianInvoices = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isUserExists = await User.findById(req.params.id);

    if (!isUserExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await MaintenanceInvoice.find(
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
        throw new Error(`Error getting technician ${isUserExists.name} maintenance invoices`);
    }
})

// @desc    Get invoices maintenance printedBy
// @route   GET /maintenance-invoice/printed-by/:id
// @access  Private - authMiddleware
const getMaintenanceInvoicesPrintedBy = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isUserExists = await User.findById(req.params.id);

    if (!isUserExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await MaintenanceInvoice.find(
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
        throw new Error(`Error getting maintenance invoices printed by ${isUserExists.name}`)
    }
})

// @desc    Get maintenance invoices issuedBy
// @route   GET /invoice/issued-by/:id
// @access  Private - authMiddleware
const getMaintenanceInvoicesIssuedBy = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isUserExists = await User.findById(req.params.id);

    if (!isUserExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await MaintenanceInvoice.find(
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
        throw new Error(`Error getting maintenance invoices issued by ${isUserExists.name}`);
    }
})

// @desc    Get maintenance invoice by payment status
// @route   GET /maintenance-invoice/payment/:id
// @access  Private - authMiddleware
const getMaintenanceInvoicesByPaymentStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || !['paid', 'unpaid'].includes(req.params.id)) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await MaintenanceInvoice.find(
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
        throw new Error(`Error getting ${req.params.id} maintenance invoices`);
    }
})

// @desc    Add new Maintenance Invoice by office user
// @route   POST /invoice/office
// @access  Private - authMiddleware
const addNewMaintenanceInvoice = asyncHandler(async (req, res) => {
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

    const result = await new MaintenanceInvoice(
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
        throw new Error('Error adding new maintenance invoice');
    }
})

// @desc    Add new Maintenance Invoice by technician
// @route   POST /maintenance-invoice/technician
// @access  Private - authMiddleware
const addMaintenanceInvoiceByTechnician = asyncHandler(async (req, res) => {
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

    const result = await new MaintenanceInvoice(
        {
            customer: isCustomerExists._id,
            products,
            services,
            total,
            technician: req.user.id,
            issuedBy: req.user.id
        }
    );

    const getLastInvoice = await MaintenanceInvoice.findOne({})
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
        throw new Error('Error adding new maintenance invoice');
    }
})

// @desc    Print maintenance invoice
// @route   PUT /maintenance-invoice/print/:id
// @access  Private - authMiddleware
const printMaintenanceInvoice = asyncHandler(async (req, res) => {
    const { toBeCollectedNow } = req.body;

    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    if (!toBeCollectedNow) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isInvoiceExists = await MaintenanceInvoice.findById(req.params.id);
    if (!isInvoiceExists) {
        res.status(400);
        throw new Error('MaintenanceInvoice not found');
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

    const updateToPrint = await MaintenanceInvoice.findByIdAndUpdate(isInvoiceExists._id, result);

    if (updateToPrint) {
        res.status(200).json({ message: 'Ready to be printed' });
    } else {
        res.status(400);
        throw new Error('Error, try again');
    }
})

// @desc    Update Maintenance Invoice status
// @route   PUT /maintenance-invoice/status/:id
// @access  Private - authMiddleware
const updateMaintenanceInvoiceStatus = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, Try again');
    }

    const isInvoiceExists = await MaintenanceInvoice.findById(req.params.id).lean();
    if (!isInvoiceExists) {
        res.status(400);
        throw new Error('MaintenanceInvoice not found');
    }

    const statusCondition = isInvoiceExists.status === 'valid' ? 'cancelled' : 'valid';

    const result = await MaintenanceInvoice.findByIdAndUpdate(
        isInvoiceExists._id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (result) {
        res.status(200).json({ message: `MaintenanceInvoice status updated to ${statusCondition}` });
    } else {
        res.status(400);
        throw new Error('Error updating maintenance invoice status');
    }
})

// @desc    Update Maintenance Invoice payment status
// @route   PUT /maintenance-invoice/payment/:id
// @access  Private - authMiddleware
const updateMaintenanceInvoicePaymentStatus = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isInvoiceExists = await MaintenanceInvoice.findById(req.params.id).lean();
    if (!isInvoiceExists) {
        res.status(400);
        throw new Error('Maintenance Invoice not found');
    }

    if (isInvoiceExists.paymentStatus === 'paid') {
        res.status(400);
        throw new Error('Maintenance Invoice already paid');
    }

    const result = await MaintenanceInvoice.findByIdAndUpdate(
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
        res.status(200).json({ message: 'Maintenance Invoice payment status updated to paid' });
    } else {
        res.status(400);
        throw new Error('Error updating maintenance invoice status');
    }
})

module.exports = {
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
}