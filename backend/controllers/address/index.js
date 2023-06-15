const asyncHandler = require('express-async-handler');
const Address = require('../../models/addressModel');

// @desc    Get All addresses
// @route   GET /address
// @access  Private - authMiddleware
const getAllAddresses = asyncHandler(async (req, res) => {
    const result = await Address.find().lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting Addresses');
    }
})

// @desc    Get specific address info
// @route   GET /address/:id
// @access  Private - authMiddleware
const getSpecificAddress = asyncHandler(async (req, res) => {
    const result = await Address.findById(req.params.id).lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting address info');
    }
})

// @desc    Add new address
// @route   POST /address
// @access  Private - authMiddleware
const addNewAddress = asyncHandler(async (req, res) => {
    const { city, zones } = req.body;

    if (!city || !zones) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (!Array.isArray(zones) || zones.length <= 0) {
        res.status(400);
        throw new Error('Please add at least one zone, and try again');
    }

    const checkUnique = await Address.findOne(
        {
            city
        }
    );

    if (checkUnique) {
        res.status(400);
        throw new Error('Please choose a unique city name, city already exists');
    }

    const newAddress = await Address.create(
        {
            city,
            zones
        }
    )

    if (newAddress) {
        res.status(200).json({ message: 'Address added successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new address');
    }
})

// @desc    Update address
// @route   PUT /address/:id
// @access  Private - authMiddleware
const updateAddress = asyncHandler(async (req, res) => {
    const { city, zones } = req.body;

    if (!city || !zones) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (!Array.isArray(zones) || zones.length <= 0) {
        res.status(400);
        throw new Error('Please add at least one zone');
    }

    const isExists = await Address.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Address not found');
    }

    const checkUnique = await Address.findOne(
        {
            _id: { $ne: req.params.id },
            city
        }
    );

    if (checkUnique) {
        res.status(400);
        throw new Error('Please choose a unique city name');
    }

    const update = await Address.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                city,
                zones
            }
        }
    );

    if (update) {
        res.status(200).json({ message: 'Address updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating address');
    }
})

// @desc    Update address status
// @route   PUT /address/status/:id
// @access  Private - authMiddleware
const updateAddressStatus = asyncHandler(async (req, res) => {
    const isExists = await Address.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Address not found');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active'

    const update = await Address.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (update) {
        res.status(200).json({ message: `Address status changed to ${statusCondition}` })
    } else {
        res.status(400);
        throw new Error('Error updating address status');
    }
})

module.exports = {
    getAllAddresses,
    getSpecificAddress,
    addNewAddress,
    updateAddress,
    updateAddressStatus
}