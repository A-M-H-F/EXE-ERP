const asyncHandler = require('express-async-handler');
const Notification = require('../../models/notificationModel');

// @desc    Get all notifications
// @route   GET /notification
// @access  Private - authMiddleware
const getAllNotifications = asyncHandler(async (req, res) => {
    const result = await Notification.find()
        .populate('from to')
        .select('-from.password -to.password')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting all notifications');
    }
})

// @desc    Get notifications by status [read, unread]
// @route   GET /notification/status/:id
// @access  Private - authMiddleware
const getNotificationsByStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || !['read', 'unread'].includes(req.params.id)) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Notification.find({ status: req.params.id })
        .populate('from to')
        .select('-from.password -to.password')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting ${req.params.id} notifications`);
    }
})

// @desc    Get specific notification
// @route   GET /notification/:id
// @access  Private - authMiddleware
const getSpecificNotification = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Notification.findById(req.params.id)
        .populate('from to')
        .select('-from.password -to.password')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting notification info`);
    }
})

// @desc    Get receiver notifications by admin
// @route   GET /notification/admin/receiver/:id
// @access  Private - authMiddleware
const getReceiverNotifications = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Notification.find({ to: req.params.id })
        .populate('from to')
        .select('-from.password -to.password')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting notification info`);
    }
})

// @desc    Get sender notifications by admin
// @route   GET /notification/admin/sender/:id
// @access  Private - authMiddleware
const getSenderNotifications = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Notification.find({ from: req.params.id })
        .populate('from to')
        .select('-from.password -to.password')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting notification info`);
    }
})

// @desc    Get receiver notifications by status [read, unread]
// @route   GET /notification/sender
// @access  Private - authMiddleware
const getReceiverNotificationsByStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!req.params.id || !status) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Notification.find({ from: req.user.id, status: status })
        .populate('from to')
        .select('-from.password -to.password')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting notification info`);
    }
})

// @desc    Get notifications by receiver
// @route   GET /notification/receiver/:id
// @access  Private - authMiddleware
const getNotificationsByReceiver = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Notification.find({ to: req.params.id })
        .populate('from to')
        .select('-from.password -to.password')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting notification info`);
    }
})

// @desc    Get notifications by sender
// @route   GET /notification/sender/:id
// @access  Private - authMiddleware
const getNotificationsBySender = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Notification.find({ from: req.params.id })
        .populate('from to')
        .select('-from.password -to.password')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting notification info`);
    }
})

// @desc    Update notification status
// @route   PUT /notification/status/:id
// @access  Private - authMiddleware
const updateNotificationStatus = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const checkNotification = await Notification.findById(req.params.id);

    if (!checkNotification) {
        res.status(400);
        throw new Error('Notification not found');
    }

    const update = await Notification.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                status: 'read'
            }
        }
    );

    if (update) {
        res.status(200).json('Notification status updated successfully');
    } else {
        res.status(400);
        throw new Error(`Error getting notification info`);
    }
})

module.exports = {
    getAllNotifications,
    getNotificationsByStatus,
    getSpecificNotification,
    getReceiverNotifications,
    getSenderNotifications,
    getReceiverNotificationsByStatus,
    getNotificationsByReceiver,
    getNotificationsBySender,
    updateNotificationStatus
}