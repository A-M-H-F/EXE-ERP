const asyncHandler = require('express-async-handler');
const SubscriptionInvoice = require('../../models/subscriptionInvoiceModel');
const Customer = require('../../models/customerModel');
const InternetService = require('../../models/internetServiceModel');

// @desc    Get All Subscription Invoices
// @route   GET /subscription-invoice
// @access  Private - authMiddleware
const getAllSubscriptionInvoices = asyncHandler(async (req, res) => {
    const { start, end, fieldType } = req.query;

    if (!start || !end) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const option = fieldType === 'Invoice Date' ? 'invoiceDate' : fieldType === 'Payment Date' ? 'paymentDate' : 'createdAt'
    const query = {};
    query[option] = { $gte: start, $lte: end };

    const result = await SubscriptionInvoice.find(query).sort({ [option]: -1 })
        .select('-__v -printHistory')
        .populate({
            path: 'customer',
            select: 'fullName accountName arabicName phoneNumber address.city address.zone address.street',
        })
        .populate({
            path: 'printedBy collector createdBy',
            select: 'name'
        })
        .populate({
            path: 'service.ref',
            select: 'isp',
            populate: {
                path: 'isp',
                select: 'code'
            }
        })
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
        .select('-__v -printHistory')
        .populate({
            path: 'customer',
            select: 'fullName accountName arabicName phoneNumber address.city address.zone address.street',
        })
        .populate({
            path: 'printedBy collector createdBy',
            select: 'name'
        })
        .populate({
            path: 'service.ref',
            select: 'isp',
            populate: {
                path: 'isp',
                select: 'code'
            }
        })
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Subscription invoice not found');
    }
})

// @desc    Get Subscription Invoice print history
// @route   GET /subscription-invoice/history/:id
// @access  Private - authMiddleware
const getSubscriptionInvoicePrintHistory = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        req.status(400);
        throw new Error('Error, try again');
    }

    const result = await SubscriptionInvoice.findById(req.params.id)
        .select('printHistory')
        .populate({
            path: 'printHistory.printedBy',
            select: 'name'
        })
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

    const { start, end, fieldType } = req.query;

    if (!start || !end) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const option = fieldType === 'Invoice Date' ? 'invoiceDate' : fieldType === 'Payment Date' ? 'paymentDate' : 'createdAt'
    const query = {};
    query[option] = { $gte: start, $lte: end };

    const isCustomerExists = await Customer.findById(req.params.id);
    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const result = await SubscriptionInvoice.find(
        {
            customer: req.params.id,
            ...query
        }
    )
        .select('-__v')
        .populate({
            path: 'customer',
            select: 'fullName accountName arabicName phoneNumber address.city address.zone address.street',
        })
        .populate({
            path: 'printedBy collector createdBy',
            select: 'name'
        })
        .populate({
            path: 'service.ref',
            select: 'isp',
            populate: {
                path: 'isp',
                select: 'code'
            }
        })
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting customer subscription invoices');
    }
})

// @desc    Add new subscription invoice
// @route   POST /subscription-invoice
// @access  Private - authMiddleware
const addNewSubscriptionInvoice = asyncHandler(async (req, res) => {
    const {
        customer,
        invoiceMonth,
        paymentStatus,
        paymentDate,
        invoiceDate
    } = req.body;

    if (!customer || !paymentStatus || !invoiceMonth) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (paymentStatus === 'paid' && !paymentDate) {
        res.status(400);
        throw new Error('Please add a payment date');
    }

    const isCustomerExists = await Customer.findById(customer);
    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    if (!isCustomerExists.service) {
        res.status(400);
        throw new Error('Please assign a service to this customer first');
    }

    const checkThisMonthInvoice = await SubscriptionInvoice.findOne({ customer, invoiceMonth });
    if (checkThisMonthInvoice) {
        res.status(400);
        throw new Error('Customer already have invoice for the selected month');
    }

    const getService = await InternetService.findById(isCustomerExists.service);

    const result = await new SubscriptionInvoice(
        {
            customer: isCustomerExists._id,
            invoiceDate,
            invoiceMonth,
            paymentStatus,
            createdBy: req.user.id,
            service: {
                ref: getService._id,
                service: getService.service,
                name: getService.name,
                price: getService.price,
                cost: getService.cost,
            }
        }
    );

    // get latest one
    const getLastSubscriptionInvoice = await SubscriptionInvoice.findOne({})
        .sort({ createdAt: -1 }).limit(1);

    let lastSerialNumber;
    let lastCounter;
    if (getLastSubscriptionInvoice) {
        lastSerialNumber = getLastSubscriptionInvoice.serialNumber;
        lastCounter = parseInt(lastSerialNumber.substring(10)); // Adjust substring to skip 'ExYYYYMM-'
    } else {
        lastCounter = 1; // Start at 1 if no previous invoice
    }

    // to be checked
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because getMonth returns a zero-based index
    const counter = getLastSubscriptionInvoice ? lastCounter + 1 : lastCounter;  // counter: starting 0
    const paddedCounter = counter.toString().padStart(6, '0'); // Pad with zeros
    const serialNumber = `Ex${year}${month}-${paddedCounter}`;

    result.serialNumber = serialNumber;

    if (paymentStatus === 'paid') {
        result.paymentDate = paymentDate;
        result.collector = req.user.id
    }

    const saveSubIn = await result.save();

    const newInvoice = await SubscriptionInvoice.findById(result._id)
        .select('-__v -printHistory')
        .populate({
            path: 'customer',
            select: 'fullName accountName arabicName phoneNumber address.city address.zone address.street',
        })
        .populate({
            path: 'printedBy collector createdBy',
            select: 'name'
        })
        .populate({
            path: 'service.ref',
            select: 'isp',
            populate: {
                path: 'isp',
                select: 'code'
            }
        })
        .lean();

    if (saveSubIn && newInvoice) {
        res.status(200).json({ message: 'Invoice added successfully', result: newInvoice });
    } else {
        res.status(400);
        throw new Error('Error creating new subscription invoice');
    }
})

// @desc    Print subscription invoice
// @route   PUT /subscription-invoice/print/:id
// @access  Private - authMiddleware
const printSubscriptionInvoice = asyncHandler(async (req, res) => {
    const { printDate } = req.body;

    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isSubscriptionInvoiceExists = await SubscriptionInvoice.findById(req.params.id);
    if (!isSubscriptionInvoiceExists) {
        res.status(400);
        throw new Error('Subscription invoice not found');
    }

    const result = {
        $set: {
            printedBy: req.user.id,
            printDate,
            updatedBy: req.user.id
        },
        $push: {
            printHistory: {
                printedBy: req.user.id,
                printDate,
            }
        },
    };

    const updateToPrint = await SubscriptionInvoice.findByIdAndUpdate(isSubscriptionInvoiceExists._id, result, { new: true })
        .select('-__v -printHistory')
        .populate({
            path: 'customer',
            select: 'fullName arabicName accountName phoneNumber address.city address.zone address.street',
        })
        .populate({
            path: 'printedBy collector createdBy',
            select: 'name'
        })
        .populate({
            path: 'service.ref',
            select: 'isp',
            populate: {
                path: 'isp',
                select: 'code'
            }
        })
        .lean();

    if (updateToPrint) {
        res.status(200).json({ message: 'Printed', result: updateToPrint });
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
                paymentDate: new Date(),
                updatedBy: req.user.id
            }
        },
        {
            new: true,
        }
    )
        .select('-__v -printHistory')
        .populate({
            path: 'customer',
            select: 'fullName accountName arabicName phoneNumber address.city address.zone address.street',
        })
        .populate({
            path: 'printedBy collector createdBy',
            select: 'name'
        })
        .populate({
            path: 'service.ref',
            select: 'isp',
            populate: {
                path: 'isp',
                select: 'code'
            }
        })
        .lean();

    if (collect) {
        res.status(200).json({ message: 'Ready to be printed', result: collect });
    } else {
        res.status(400);
        throw new Error('Error, please try again');
    }
})

module.exports = {
    getAllSubscriptionInvoices,
    getSpecificSubscriptionInvoice,
    getCustomerSubscriptionInvoices,
    addNewSubscriptionInvoice,
    printSubscriptionInvoice,
    collectSubscriptionInvoice,
    getSubscriptionInvoicePrintHistory
}