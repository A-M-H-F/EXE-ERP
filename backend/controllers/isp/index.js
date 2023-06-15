const asyncHandler = require('express-async-handler');
const ISP = require('../../models/ispModel');
const InternetService = require('../../models/internetServiceModel');

// @desc    Get all ISP
// @route   GET /isp
// @access  Private - authMiddleware
const getAllIsp = asyncHandler(async (req, res) => {
    const isps = await ISP.find().lean();

    if (isps) {
        res.status(200).json(isps);
    } else {
        res.status(400);
        throw new Error('Error getting ISPs');
    }
})

// @desc    Get specific ISP
// @route   GET /isp/:id
// @access  Private - authMiddleware
const getSpecificIsp = asyncHandler(async (req, res) => {
    const isp = await ISP.findById(req.params.id).lean();

    if (isp) {
        res.status(200).json(isp);
    } else {
        res.status(400);
        throw new Error('Error getting ISP');
    }
})

// @desc    Add New ISP
// @route   POST /isp
// @access  Private - authMiddleware
const addNewIsp = asyncHandler(async (req, res) => {
    const { name, address, phoneNumbers } = req.body;

    if (!name || !address || !phoneNumbers) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (typeof phoneNumbers !== 'array' || phoneNumbers.length <= 0) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const checkIsp = await ISP.findOne(
        { name }
    );

    if (checkIsp) {
        res.status(400);
        throw new Error('Please choose a new name');
    }

    const newIsp = await ISP.create(
        {
            name,
            address,
            phoneNumbers
        }
    )

    if (newIsp) {
        res.status(200).json({ message: 'New ISP added successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new ISP');
    }
})

// @desc    Update ISP
// @route   PUT /isp/:id
// @access  Private - authMiddleware
const updateIsp = asyncHandler(async (req, res) => {
    const { name, address, phoneNumbers } = req.body;

    if (!name || !address || !phoneNumbers) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isExists = await ISP.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('ISP not found');
    }

    const findExists = await ISP.findOne(
        {
            _id: { $ne: req.params.id },
            $or: [
                { name },
                { address }
            ]
        }
    );

    if (findExists) {
        res.status(400);
        throw new Error('Please choose different name or address');
    }

    const upISP = await ISP.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                name,
                address,
                phoneNumbers
            }
        }
    );

    if (upISP) {
        res.status(200).json({ message: 'ISP updated Successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating ISP');
    }
})

// @desc    Update ISP
// @route   PUT /isp/status/:id
// @access  Private - authMiddleware
const updateIspStatus = asyncHandler(async (req, res) => {
    const isExists = await ISP.findById(req.param.id).lean();

    if (!isExists) {
        res.status(400);
        throw new Error('ISP not found');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active';

    const updatedIspStatus = await ISP.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (updatedIspStatus) {
        res.status(200).json({ message: `ISP status updated to ${statusCondition}` });
    } else {
        res.status(400);
        throw new Error('Error updating ISP status');
    }
})

// @desc    Delete ISP
// @route   DELETE /isp/:id
// @access  Private - authMiddleware
const removeISP = asyncHandler(async (req, res) => {
    const isExists = await ISP.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('ISP not found');
    }

    const checkIsExists = await InternetService.find(
        {
            isp: isExists._id
        }
    )

    if (checkIsExists) {
        const total = checkIsExists.length;
        res.status(400);
        throw new Error(`Please remove this ISP from the ${total} Internet services, and try again`)
    }

    const remove = await ISP.findByIdAndDelete(isExists._id);

    if (remove) {
        res.status(200).json({ message: 'ISP removed successfully' });
    } else {
        res.status(400);
        throw new Error('Error removing ISP');
    }
})

module.exports = {
    getAllIsp,
    getSpecificIsp,
    addNewIsp,
    updateIsp,
    removeISP,
    updateIspStatus
}