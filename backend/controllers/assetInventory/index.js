const asyncHandler = require('express-async-handler');
const AssetInventory = require('../../models/assetInventoryModel');
const Asset = require('../../models/assetModel');

// @desc    Get All assets inventory
// @route   GET /asset-inventory
// @access  Private - authMiddleware
const getAllAssetInventory = asyncHandler(async (req, res) => {
    const assets = await AssetInventory.find()
        .populate('asset')
        .lean();

    if (assets) {
        res.status(200).json(assets);
    } else {
        res.status(400);
        throw new Error('Error getting inventory');
    }
})

// @desc    Get assets inventory by status
// @route   GET /asset-inventory/status/:id
// @access  Private - authMiddleware
const getAssetsInventoryByStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || !['active', 'inactive'].includes(req.params.id)) {
        res.status(400);
        throw new Error('Please try again');
    }

    const assets = await AssetInventory.find({ status: req.params.id })
        .populate('asset')
        .lean();

    if (assets) {
        res.status(200).json(assets);
    } else {
        res.status(400);
        throw new Error('Error getting active assets');
    }
})

// @desc    Add new asset to inventory
// @route   POST /asset-inventory
// @access  Private - authMiddleware
const addNewAssetToInventory = asyncHandler(async (req, res) => {
    const {
        asset,
        cost,
        serialNumber,
        macAddress,
        ipAddress,
        azimuth,
        tilt,
        currentStatus,
        currentLocation,
        date,
        locationsHistory,
        note
    } = req.body;

    if (!asset || !serialNumber) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const checkAsset = await Asset.findById(asset);

    if (!checkAsset) {
        res.status(400);
        throw new Error('Asset not found');
    }

    const addToInventory = await AssetInventory.create(
        {
            asset,
            cost,
            serialNumber,
            macAddress,
            ipAddress,
            azimuth,
            tilt,
            currentStatus,
            currentLocation,
            date,
            locationsHistory,
            note,
            addedBy: req.user.id
        }
    );

    if (addToInventory) {
        res.status(200).json({ message: 'Asset added to inventory successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new asset to inventory');
    }
})

// @desc    Update asset inside inventory
// @route   PUT /asset-inventory/:id
// @access  Private - authMiddleware
const updateAssetInInventory = asyncHandler(async (req, res) => {
    const {
        asset,
        cost,
        serialNumber,
        macAddress,
        ipAddress,
        azimuth,
        tilt,
        currentStatus,
        currentLocation,
        date,
        note
    } = req.body;

    if (!asset || !serialNumber) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isExists = await AssetInventory.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Asset not found inside inventory');
    }

    const checkAsset = await Asset.findById(asset);
    if (!checkAsset) {
        res.status(400);
        throw new Error('Asset not found');
    }

    const checkDuplicates = await AssetInventory.find(
        {
            _id: { $ne: req.params.id },
            $or: [
                { serialNumber },
                { macAddress },
                { ipAddress }
            ]
        }
    );

    if (checkDuplicates) {
        res.status(400);
        throw new Error(
            'Please check one of this fields, SerialNumber/macAddress/ipAddress, there is duplicates inside the inventory'
        );
    }

    const updatedLocationHistory = isExists.locationsHistory.push(
        {
            location: isExists.currentLocation,
            date: isExists.date
        }
    );

    const updatedAsset = await AssetInventory.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                asset,
                cost,
                serialNumber,
                macAddress,
                ipAddress,
                azimuth,
                tilt,
                currentStatus,
                currentLocation,
                date,
                locationsHistory: updatedLocationHistory,
                note,
                updatedBy: req.user.id
            }
        }
    );

    if (updatedAsset) {
        res.status(200).json({ message: 'Asset updated successfully inside the inventory' });
    } else {
        res.status(400);
        throw new Error('Error updating asset inside inventory');
    }
})

// @desc    Update asset status inside inventory
// @route   PUT /asset-inventory/status/:id
// @access  Private - authMiddleware
const updateAssetStatusInInventory = asyncHandler(async (req, res) => {
    const isExists = await AssetInventory.findById(req.params.id).lean();

    if (!isExists) {
        res.status(400);
        throw new Error('Asset not found inside inventory');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active';

    const newStatus = await AssetInventory.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (newStatus) {
        res.status(200).json({ message: `Asset status inside inventory updated to ${statusCondition}` });
    } else {
        res.status(400);
        throw new Error('Error updating asset status inside inventory');
    }
})

// @desc    Remove assets from inventory
// @route   DELETE /asset-inventory/:id
// @access  Private - authMiddleware
const removeAssetFromInventory = asyncHandler(async (req, res) => {
    const isExists = await AssetInventory.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Asset not found inside inventory');
    }

    const remove = await AssetInventory.findByIdAndDelete(req.params.id);

    if (remove) {
        res.status(200).json({ message: 'Asset removed from inventory successfully' });
    } else {
        res.status(400);
        throw new Error('Error removing asset from inventory');
    }
})

module.exports = {
    getAllAssetInventory,
    getAssetsInventoryByStatus,
    addNewAssetToInventory,
    updateAssetInInventory,
    updateAssetStatusInInventory,
    removeAssetFromInventory
}