const asyncHandler = require('express-async-handler');
const SubscriptionHistory = require('../../models/subscriptionHistoryModel');
const Customer = require('../../models/customerModel');
const InternetService = require('../../models/internetServiceModel');

// @desc    Get All Subscriptions
// @route   GET /subscription
// @access  Private - authMiddleware
const getAllSubscriptions = asyncHandler(async (req, res) => {
    const result = await SubscriptionHistory.find().sort({ createdAt: -1 })
        .select('-serviceHistory -__v')
        .populate({
            path: 'customer',
            select: 'fullName',
            populate: {
                path: 'service',
                select: 'service'
            }
        })
        .populate({
            path: 'createdBy updatedBy',
            select: 'name'
        })
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('No subscriptions history found');
    }
})

// @desc    Get Specific SubscriptionHistory info (helper)
// @route   GET /subscription/:id
// @access  Private - authMiddleware
const getSpecificSubscription = asyncHandler(async (req, res) => {
    const result = await SubscriptionHistory.findOne({ customer: req.params.id })
        .select('-__v')
        .populate({
            path: 'customer',
            select: 'fullName',
            populate: {
                path: 'service',
                select: 'service'
            }
        })
        .populate({
            path: 'serviceHistory.service',
            select: 'service'
        })
        .populate({
            path: 'serviceHistory.changedBy',
            select: 'name'
        })
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('No subscriptions history found');
    }
})

module.exports = {
    getAllSubscriptions,
    getSpecificSubscription
}