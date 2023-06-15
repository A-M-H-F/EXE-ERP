const router = require('express').Router();
const {
    getAllServices,
    getActiveServices,
    getInactiveServices,
    addNewService,
    updateService,
    updateServiceStatus
} = require('../../controllers/service');
const auth = require('../../middleware/auth');

// routes: 6

// @desc    Get All Services
// @route   GET /service
// @access  Private - authMiddleware
router.get('/', auth, getAllServices);

// @desc    Get active Services
// @route   GET /service/active
// @access  Private - authMiddleware
router.get('/active', auth, getActiveServices);

// @desc    Get inactive Services
// @route   GET /service/inactive
// @access  Private - authMiddleware
router.get('/inactive', auth, getInactiveServices);

// @desc    Add new Service
// @route   PosT /service
// @access  Private - authMiddleware
router.post('/', auth, addNewService);

// @desc    Update Service
// @route   PUT /service/:id
// @access  Private - authMiddleware
router.put('/:id', auth, updateService);

// @desc    Update Service status
// @route   PUT /service/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateServiceStatus);

module.exports = router;