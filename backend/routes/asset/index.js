const router = require('express').Router();
const {
    getAllAssets,
    addNewAsset,
    updateAsset,
    updateAssetStatus,
    deleteAsset,
    getAssetsByStatus
} = require('../../controllers/asset');
const auth = require('../../middleware/auth');

// routes: 7

// @desc    Get All assets
// @route   GET /asset
// @access  Private - authMiddleware
router.get('/', auth, getAllAssets);

// @desc    Get assets by status
// @route   GET /asset/active
// @access  Private - authMiddleware
router.get('/status/:id', auth, getAssetsByStatus);

// @desc    Add new asset
// @route   POST /asset
// @access  Private - authMiddleware
router.post('/', auth, addNewAsset);

// @desc    Update asset
// @route   PUT /asset/:id
// @access  Private - authMiddleware
router.put('/:id', auth, updateAsset);

// @desc    Update asset status
// @route   PUT /asset/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateAssetStatus);

// @desc    Delete asset
// @route   Delete /asset/:id
// @access  Private - authMiddleware
router.delete('/:id', auth, deleteAsset);

module.exports = router;