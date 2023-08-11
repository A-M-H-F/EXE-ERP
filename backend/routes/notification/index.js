const router = require('express').Router();
const auth = require('../../middleware/auth');
const {
    getAllNotifications,
    getNotificationsByStatus,
    getSpecificNotification,
    getReceiverNotifications,
    getSenderNotifications,
    getReceiverNotificationsByStatus,
    getNotificationsByReceiver,
    getNotificationsBySender,
    updateNotificationStatus 
} = require('../../controllers/notification');

// @desc    Get all notifications
// @route   GET /notification
// @access  Private - authMiddleware
router.get('/', auth, getAllNotifications);

// @desc    Get notifications by status [read, unread]
// @route   GET /notification/status/:id
// @access  Private - authMiddleware
router.get('/status/:id', auth, getNotificationsByStatus);

// @desc    Get specific notification
// @route   GET /notification/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificNotification);

// @desc    Get receiver notifications by admin
// @route   GET /notification/admin/receiver/:id
// @access  Private - authMiddleware
router.get('/admin/receiver/:id', auth, getReceiverNotifications);

// @desc    Get sender notifications by admin
// @route   GET /notification/admin/sender/:id
// @access  Private - authMiddleware
router.get('/admin/sender/:id', auth, getSenderNotifications);

// @desc    Get receiver notifications by status [read, unread]
// @route   GET /notification/sender
// @access  Private - authMiddleware
router.get('/sender', auth, getReceiverNotificationsByStatus);

// @desc    Get notifications by receiver
// @route   GET /notification/receiver/:id
// @access  Private - authMiddleware
router.get('/receiver/:id', auth, getNotificationsByReceiver);

// @desc    Get notifications by sender
// @route   GET /notification/sender/:id
// @access  Private - authMiddleware
router.get('/sender/:id', auth, getNotificationsBySender);

// @desc    Update notification status
// @route   PUT /notification/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateNotificationStatus);

module.exports = router;
