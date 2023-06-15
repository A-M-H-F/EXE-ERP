const router = require('express').Router();
const {
    getAllAddresses,
    getSpecificAddress,
    addNewAddress,
    updateAddress, 
    updateAddressStatus} = require('../../controllers/address');
const auth = require('../../middleware/auth');

// 5 routes

// @desc    Get All addresses
// @route   GET /address
// @access  Private - authMiddleware
router.get('/', auth, getAllAddresses);

// @desc    Get specific address info
// @route   GET /address/:id
// @access  Private - (authMiddleware, authMiddleware)
router.get('/:id', auth, getSpecificAddress);

// @desc    Add new address
// @route   POST /address
// @access  Private - (authMiddleware, authMiddleware)
router.post('/', auth, addNewAddress);

// @desc    Update address
// @route   PUT /address/:id
// @access  Private - (authMiddleware, authMiddleware)
router.put('/:id', auth, updateAddress);

// @desc    Update address status
// @route   PUT /address/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateAddressStatus);

module.exports = router;
