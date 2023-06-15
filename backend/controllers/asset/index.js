const asyncHandler = require('express-async-handler');
const Asset = require('../../models/assetModel');
const AssetInventory = require('../../models/assetInventoryModel');

// @desc    Get All assets
// @route   GET /asset
// @access  Private - authMiddleware
const getAllAssets = asyncHandler(async (req, res) => {
    const assets = await Asset.find().lean();

    if (assets) {
        res.status(200).json(assets);
    } else {
        res.status(400);
        throw new Error('Error getting assets');
    }
})

// @desc    Get assets by status
// @route   GET /asset/status/:id
// @access  Private - authMiddleware
const getAssetsByStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || !['active', 'inactive'].includes(req.params.id)) {
        res.status(400);
        throw new Error('Error, please try again');
    }

    const result = await Asset.find({ status: req.params.id }).lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting ${req.params.id} assets`);
    }
})

// @desc    Add new asset
// @route   POST /asset
// @access  Private - authMiddleware
const addNewAsset = asyncHandler(async (req, res) => {
    const { name, brand } = req.body;

    if (!name || !brand) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const checkUnique = await Asset.findOne(
        {
            name
        }
    );

    if (checkUnique) {
        res.status(400);
        throw new Error('Please choose a unique name');
    }

    const createAsset = await Asset.create(
        {
            name,
            brand,
            addedBy: req.user.id
        }
    );

    if (createAsset) {
        res.status(200).json({ message: 'Asset added successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new assets');
    }
})

// @desc    Update asset
// @route   PUT /asset/:id
// @access  Private - authMiddleware
const updateAsset = asyncHandler(async (req, res) => {
    const { name, brand } = req.body;

    const isExists = await Asset.findById(req.params.id).lean();

    if (!isExists) {
        res.status(400);
        throw new Error('Asset not found');
    }

    const updatedAsset = await Asset.findByIdAndUpdate(
        isExists._id,
        {
            name,
            brand,
            updatedBy: req.user.id
        }
    );

    if (updatedAsset) {
        res.status(200).json({ message: 'Asset updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating asset');
    }
})

// @desc    Update asset status
// @route   PUT /asset/status/:id
// @access  Private - authMiddleware
const updateAssetStatus = asyncHandler(async (req, res) => {
    const isExists = await Asset.findById(req.params.id).lean();

    if (!isExists) {
        res.status(400);
        throw new Error('Asset not found');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active';

    const updatedStatus = await Asset.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                status: statusCondition,
                updatedBy: req.user.id
            }
        }
    );

    if (updatedStatus) {
        res.status(200).json({ message: `Asset status updated to ${statusCondition}` });
    } else {
        res.status(400);
        throw new Error('Error updating asset status');
    }
})

// @desc    Delete asset
// @route   Delete /asset/:id
// @access  Private - authMiddleware
const deleteAsset = asyncHandler(async (req, res) => {
    const isExists = await Asset.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Asset not found');
    }

    const checkInventory = await AssetInventory.find(
        {
            asset: isExists._id
        }
    )

    if (checkInventory) {
        const total = checkInventory.length;

        res.status(400);
        throw new Error(`Please remove this asset from inventory first, you have ${total} assets inside inventory`);
    }

    const removeAsset = await Asset.findByIdAndDelete(req.params.id);

    if (removeAsset) {
        res.status(200).json({ message: 'Asset deleted successfully ' });
    } else {
        res.status(400);
        throw new Error('Error deleting asset');
    }
})

module.exports = {
    getAllAssets,
    getAssetsByStatus,
    addNewAsset,
    updateAsset,
    updateAssetStatus,
    deleteAsset
}