const asyncHandler = require('express-async-handler');
const Subscription = require('../../models/subscriptionModel');
const Customer = require('../../models/customerModel');
const User = require('../../models/userModel');
const InternetService = require('../../models/internetServiceModel');

// @desc    Get All Subscriptions
// @route   GET /subscription
// @access  Private - authMiddleware
const getAllSubscriptions = asyncHandler(async (req, res) => {
    const result = await Subscription.find()
        .select('-serviceHistory')
        .populate('customer service addedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscriptions');
    }
})

// @desc    Get Specific Subscription info (helper)
// @route   GET /subscription/:id
// @access  Private - authMiddleware
const getSpecificSubscription = asyncHandler(async (req, res) => {
    const result = await Subscription.findById(req.params.id)
        .select('-serviceHistory')
        .populate('customer service addedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription');
    }
})

// @desc    Get Customer current subscription
// @route   GET /subscription/customer/:id
// @access  Private - authMiddleware
const getCustomerCurrentSubscription = asyncHandler(async (req, res) => {
    const isCustomerExists = await Customer.findById(req.params.id);

    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const result = await Subscription.findOne(
        {
            customer: isCustomerExists._id
        }
    )
        .select('-serviceHistory')
        .populate('customer service addedBy');

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting customer subscription');
    }
})

// @desc    Get Customer subscriptions history
// @route   GET /subscription/customer/history/:id
// @access  Private - authMiddleware
const getCustomerSubscriptionHistory = asyncHandler(async (req, res) => {
    const isCustomerExists = await Customer.findById(req.params.id);

    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const result = await Subscription.findOne(
        {
            customer: isCustomerExists._id
        }
    )
        .select('serviceHistory')
        .populate('serviceHistory.service serviceHistory.addedBy');

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting customer subscription history');
    }
})

// @desc    Get User subscriptions
// @route   GET /subscription/user/:id
// @access  Private - authMiddleware
const getSubscriptionAddedByUser = asyncHandler(async (req, res) => {
    const isUserExists = await User.findById(res.params.id);

    if (!isUserExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const result = await Subscription.find(
        {
            addedBy: req.params.id
        }
    )
        .select('-serviceHistory')
        .populate('customer service')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting subscriptions added by ${isUserExists.name}`)
    }
})

// @desc    Get Internet Service Subscriptions
// @route   GET /subscription/internet-service/:id
// @access  Private - authMiddleware
const getInternetServiceSubscriptions = asyncHandler(async (req, res) => {
    const isInternetServiceExists = await InternetService.findById(req.params.id);

    if (!isInternetServiceExists) {
        res.status(400);
        throw new Error('Internet service not found');
    }

    const result = await Subscription.find(
        {
            service: isInternetServiceExists._id
        }
    )
        .select('-serviceHistory')
        .populate('customer addedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting internet service subscriptions');
    }
})

// @desc    Get Subscription by qrCode
// @route   GET /subscription/qr-code
// @access  Private - authMiddleware
const getSubscriptionByQrCode = asyncHandler(async (req, res) => { // to be modified
    const { qrCode } = req.body;

    if (!qrCode) {
        res.status(400);
        throw new Error('Please try again');
    }

    const result = await Subscription.findOne(
        {
            qrCode
        }
    )
        .select('-serviceHistory')
        .populate('customer service addedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting subscription by qrCode');
    }
})

// @desc    Add new subscription
// @route   POST /subscription
// @access  Private - authMiddleware
const addNewSubscription = asyncHandler(async (req, res) => {
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

    const checkCustomerSubscription = await Subscription.findOne(
        {
            customer: isCustomerExists._id
        }
    );
    if (checkCustomerSubscription) {
        res.status(400);
        throw new Error('Customer already have subscription');
    }

    const isInternetServiceExists = await InternetService.findById(service);
    if (!isInternetServiceExists) {
        res.status(400);
        throw new Error('Internet service not found');
    }

    const newSubscription = await new Subscription(
        {
            customer: isCustomerExists._id,
            service: isInternetServiceExists._id,
            addedBy: req.user.id
        }
    );

    newSubscription.qrCode = `${process.env.CLIENT_URL}/subscription/${newSubscription._id}`;

    const generateSerialNumber = newSubscription._id
        + isCustomerExists._id + isInternetServiceExists._id;

    newSubscription.serialNumber = generateSerialNumber;

    const saveSubscription = await newSubscription.save();

    if (saveSubscription) {
        res.status(200).json({ message: 'New subscription added successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new subscription');
    }
})

// @desc    change customer subscription service
// @route   PUT /subscription/:id
// @access  Private - authMiddleware
const changeCustomerSubscriptionService = asyncHandler(async (req, res) => {
    const { service } = req.body;

    if (!service) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isInternetServiceExists = await InternetService.findById(service);
    if (!isInternetServiceExists) {
        res.status(400);
        throw new Error('Internet service not found');
    }

    const checkSubscription = await Subscription.findById(req.params.id)
        .select('customer');
    if (!checkSubscription) {
        res.status(400);
        throw new Error('Error getting subs')
    }

    const generateSerialNumber = checkSubscription._id +
        checkSubscription.customer._id + isInternetServiceExists._id;

    const addOldSubToHistory = {
        service: checkSubscription.service,
        addedBy: checkSubscription.addedBy,
        serialNumber: checkSubscription.serialNumber,
        changeDate: new Date()
    };

    const updateSub = await Subscription.findByIdAndUpdate(
        checkSubscription._id,
        {
            $set: {
                service,
                serialNumber: generateSerialNumber,
                addedBy: req.user.id,
            },
            $push: {
                serviceHistory: addOldSubToHistory
            }
        }
    );

    if (updateSub) {
        res.status(200).json({ message: 'Customer subscription changed successfully' });
    } else {
        res.status('400');
        throw new Error('Error changing customer subscription');
    }
})

module.exports = {
    getAllSubscriptions,
    getSpecificSubscription,
    getCustomerCurrentSubscription,
    getCustomerSubscriptionHistory,
    getSubscriptionAddedByUser,
    getInternetServiceSubscriptions,
    getSubscriptionByQrCode,
    addNewSubscription,
    changeCustomerSubscriptionService
}