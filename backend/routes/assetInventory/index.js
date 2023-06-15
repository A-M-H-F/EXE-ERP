const router = require('express').Router();
const {
    getAllAssetInventory,
    addNewAssetToInventory,
    updateAssetInInventory,
    updateAssetStatusInInventory,
    removeAssetFromInventory,
    getAssetsInventoryByStatus
} = require('../../controllers/assetInventory');
const auth = require('../../middleware/auth');

// routes: 6

// @desc    Get All assets inventory
// @route   GET /asset-inventory
// @access  Private - authMiddleware
router.get('/', auth, getAllAssetInventory);

// @desc    Get active assets inventory
// @route   GET /asset-inventory/status/:id
// @access  Private - authMiddleware
router.get('/status/:id', auth, getAssetsInventoryByStatus);

// @desc    Add new asset to inventory
// @route   POST /asset-inventory
// @access  Private - authMiddleware
router.post('/', auth, addNewAssetToInventory);

// @desc    Update asset inside inventory
// @route   PUT /asset-inventory/:id
// @access  Private - authMiddleware
router.put('/:id', auth, updateAssetInInventory);

// @desc    Update asset status inside inventory
// @route   PUT /asset-inventory/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateAssetStatusInInventory);

// @desc    Remove assets from inventory
// @route   DELETE /asset-inventory/:id
// @access  Private - authMiddleware
router.delete('/:id', auth, removeAssetFromInventory);

module.exports = router;
