const asyncHandler = require('express-async-handler');
const SubscriptionInvoice = require('../../models/subscriptionInvoiceModel');
const Subscription = require('../../models/subscriptionModel');
const Customer = require('../../models/customerModel');
const User = require('../../models/userModel');
const InternetService = require('../../models/internetServiceModel');
const moment = require('moment');

// populate: customer/service/printedBy/collector

// @desc    Get All Subscription Invoices
// @route   GET /subscription-invoice
// @access  Private - authMiddleware
const getAllSubscriptionInvoices = asyncHandler(async (req, res) => {
    const result = await SubscriptionInvoice.find()
        .populate('customer service printedBy collector')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoices');
    }
})

// @desc    Get Specific Subscription Invoice info (helper)
// @route   GET /subscription-invoice/:id
// @access  Private - authMiddleware
const getSpecificSubscriptionInvoice = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        req.status(400);
        throw new Error('Error, try again');
    }

    const result = await SubscriptionInvoice.findById(req.params.id)
        .populate('customer service printedBy collector')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoice info');
    }
})

// @desc    Get Customer subscription invoices
// @route   GET /subscription-invoice/customer/:id
// @access  Private - authMiddleware
const getCustomerSubscriptionInvoices = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        req.status(400);
        throw new Error('Error, try again');
    }

    const isCustomerExists = await Customer.findById(req.params.id);

    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const result = await SubscriptionInvoice.find(
        {
            customer: req.params.id
        }
    )
        .populate('service printedBy collector').lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting customer subscription invoices');
    }
})

// @desc    Get Internet service subscription invoices
// @route   GET /subscription-invoice/internet-service/:id
// @access  Private - authMiddleware
const getSubscriptionInvoicesByIS = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        req.status(400);
        throw new Error('Error, try again');
    }

    const isInternetServiceExists = await InternetService.findById(req.params.id);

    if (!isInternetServiceExists) {
        res.status(400);
        throw new Error('Internet service not found');
    }

    const result = await SubscriptionInvoice.find(
        {
            service: isInternetServiceExists._id
        }
    )
        .populate('customer printedBy collector')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoices by internet service');
    }
})

// @desc    Get subscription invoice by qrCode
// @route   GET /subscription-invoice/qr-code
// @access  Private - authMiddleware
const getSubscriptionInvoiceByQrCode = asyncHandler(async (req, res) => { // to be modified
    const { qrCode } = req.body;

    const result = await SubscriptionInvoice.findOne(
        {
            qrCode
        }
    )
        .populate('customer service printedBy collector')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoice by qrCode');
    }
})

// @desc    Get subscription invoices by paymentStatus (paid-unpaid)
// @route   GET /subscription-invoice/status/:id
// @access  Private - authMiddleware
const getSubscriptionInvoicesByPaymentStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || !['paid', 'unpaid'].includes(req.params.id)) {
        res.status(400);
        throw new Error('Please try again');
    }

    const result = await SubscriptionInvoice.find(
        {
            paymentStatus: req.params.id
        }
    )
        .populate('customer service printedBy collector')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoices by payment status');
    }
})

// @desc    Get subscription invoices for this month
// @route   GET /subscription-invoice/month
// @access  Private - authMiddleware
const getSubscriptionInvoiceForCurrentMonth = asyncHandler(async (req, res) => {
    const now = moment();
    const start = now.startOf('month').toDate();
    const end = now.endOf('month').toDate();
  
    const result = await SubscriptionInvoice.find({
      invoiceDate: { $gte: start, $lte: end }
    })
      .populate('customer service printedBy collector')
      .lean();
  
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400);
      throw new Error('Error getting subscription invoices for current month');
    }
  });

// @desc    Get subscription invoices for a specific range of date
// @route   GET /subscription-invoice/date
// @access  Private - authMiddleware
const getSubscriptionInvoiceByRangeOfDate = asyncHandler(async (req, res) => {
    const { start, end } = req.body;

    if (!start || !end) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const result = await SubscriptionInvoice.find({
        invoiceDate: { $gte: startDate, $lte: endDate }
    })
        .populate('customer service printedBy collector')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoice by range of date');
    }
})

// @desc    Get subscription invoices by collector
// @route   GET /subscription-invoice/collector/:id
// @access  Private - authMiddleware
const getSubscriptionInvoiceByCollector = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        req.status(400);
        throw new Error('Error, try again');
    }

    const isExists = await User.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await SubscriptionInvoice.find(
        {
            collector: isExists._id
        }
    )
        .populate('customer service printedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoices by collector');
    }
})

// @desc    Get subscription invoices printedBy a user
// @route   GET /subscription-invoice/printed-by/:id
// @access  Private - authMiddleware
const getSubscriptionInvoicePrintedBy = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isExists = await User.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await SubscriptionInvoice.find(
        {
            printedBy: req.params.id
        }
    )
        .populate('customer service collector')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoices by user');
    }
})

// @desc    Get subscription invoice by serialNumber
// @route   GET /subscription-invoice/serial/:id
// @access  Private - authMiddleware
const getSubscriptionInvoiceBySerialNumber = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await SubscriptionInvoice.findOne(
        {
            serialNumber: req.params.id
        }
    )
        .populate('customer service printedBy collector')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription invoice by serial number');
    }
})

// @desc    Add new subscription invoice
// @route   POST /subscription-invoice
// @access  Private - authMiddleware
const addNewSubscriptionInvoice = asyncHandler(async (req, res) => {
    const {
        customer,
        service
    } = req.body;

    if (!customer || !service) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isCustomerExists = await Customer.findById(customer);
    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const isInternetServiceExists = await InternetService.findById(service);
    if (!isInternetServiceExists) {
        res.status(400);
        throw new Error('Internet service not found');
    }

    const result = await new SubscriptionInvoice(
        {
            customer: isCustomerExists._id,
            service: isInternetServiceExists._id,
            invoiceDate: new Date()
        }
    );

    // get latest one
    const getLastSubscriptionInvoice = await SubscriptionInvoice.findOne({})
        .sort({ createdAt: -1 }).limit(1);

    let lastSerialNumber;
    let lastCounter;
    if (getLastSubscriptionInvoice) {
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
    result.qrCode = `${process.env.CLIENT_URL}/subscription-invoice/${result._id}`;

    const saveSubIn = await result.save();

    if (saveSubIn) {
        res.status(200).json(result._id);
    } else {
        res.status(400);
        throw new Error('Error creating new subscription invoice');
    }
})

// @desc    Print subscription invoice
// @route   PUT /subscription-invoice/print/:id
// @access  Private - authMiddleware
const printSubscriptionInvoice = asyncHandler(async (req, res) => {
    const { toBeCollectedNow } = req.body;

    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    if (!toBeCollectedNow) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isSubscriptionInvoiceExists = await SubscriptionInvoice.findById(req.params.id);

    if (!isSubscriptionInvoiceExists) {
        res.status(400);
        throw new Error('Subscription invoice not found');
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

    const updateToPrint = await Subscription.findByIdAndUpdate(isSubscriptionInvoiceExists._id, result);

    if (updateToPrint) {
        res.status(200).json({ message: 'Ready to be printed' });
    } else {
        res.status(400);
        throw new Error('Error, try again');
    }
})

// @desc    Collect subscription invoice
// @route   PUT /subscription-invoice/collect/:id
// @access  Private - authMiddleware
const collectSubscriptionInvoice = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isSubscriptionInvoiceExists = await SubscriptionInvoice.findById(req.params.id);

    if (!isSubscriptionInvoiceExists) {
        res.status(400);
        throw new Error('Subscription invoice not found');
    }

    if (isSubscriptionInvoiceExists.collector) {
        res.status(400);
        throw new Error('Already collected');
    }

    const collect = await SubscriptionInvoice.findByIdAndUpdate(
        isSubscriptionInvoiceExists._id,
        {
            $set: {
                collector: req.user.id,
                paymentStatus: 'paid',
                paymentDate: new Date()
            }
        }
    );

    if (collect) {
        res.status(200).json({ message: 'Ready to be printed' });
    } else {
        res.status(400);
        throw new Error('Error, please try again');
    }
})

// @desc    Update subscription invoice
// @route   PUT /subscription-invoice/:id
// @access  Private - authMiddleware

module.exports = {
    getAllSubscriptionInvoices,
    getSpecificSubscriptionInvoice,
    getCustomerSubscriptionInvoices,
    getSubscriptionInvoicesByIS,
    getSubscriptionInvoiceByQrCode,
    getSubscriptionInvoicesByPaymentStatus,
    getSubscriptionInvoiceForCurrentMonth,
    getSubscriptionInvoiceByRangeOfDate,
    getSubscriptionInvoiceByCollector,
    getSubscriptionInvoicePrintedBy,
    getSubscriptionInvoiceBySerialNumber,
    addNewSubscriptionInvoice,
    printSubscriptionInvoice,
    collectSubscriptionInvoice
}