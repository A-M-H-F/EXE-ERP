const asyncHandler = require('express-async-handler');
const ISP = require('../../models/ispModel');
const InternetService = require('../../models/internetServiceModel');

// @desc    Get all ISP
// @route   GET /isp
// @access  Private - authMiddleware
const getAllIsp = asyncHandler(async (req, res) => {
    const isps = await ISP.find()
        .select('-__v')
        .populate(
            {
                path: 'createdBy updatedBy',
                select: 'name'
            }
        )
        .lean();

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
    const isp = await ISP.findById(req.params.id)
        .select('-__v')
        .populate(
            {
                path: 'createdBy updatedBy',
                select: 'name'
            }
        )
        .lean();

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
    const { name, address, phoneNumbers, contactInfo, code } = req.body;

    if (!name || !address || !phoneNumbers || !code) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (!phoneNumbers || phoneNumbers.length <= 0) {
        res.status(400);
        throw new Error('Please add at lease 1 phone number');
    }

    const checkIsp = await ISP.findOne(
        {
            $or: [
                { name },
                { address },
                { contactInfo },
                { code }
            ]
        }
    );

    if (checkIsp) {
        res.status(400);
        throw new Error('Please choose a unique name/address/contact Info/code');
    }

    const newIsp = await ISP.create(
        {
            name,
            code,
            address,
            phoneNumbers,
            contactInfo,
            createdBy: req.user.id
        }
    )

    const result = await ISP.findById(newIsp._id)
        .select('-__v')
        .populate(
            {
                path: 'createdBy updatedBy',
                select: 'name'
            }
        )
        .lean();

    if (newIsp && result) {
        res.status(200).json({ message: 'New ISP added successfully', result });
    } else {
        res.status(400);
        throw new Error('Error adding new ISP');
    }
})

// @desc    Update ISP
// @route   PUT /isp/:id
// @access  Private - authMiddleware
const updateIsp = asyncHandler(async (req, res) => {
    const { name, address, phoneNumbers, contactInfo, code } = req.body;

    if (!name || !address || !phoneNumbers || !code) {
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
                { address },
                { contactInfo },
                { code }
            ]
        }
    );

    if (findExists) {
        res.status(400);
        throw new Error('Please choose different name/address/contact info/code');
    }

    const result = await ISP.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                name,
                code,
                address,
                phoneNumbers,
                contactInfo,
                updatedBy: req.user.id
            }
        },
        {
            new: true
        }
    )
        .select('-__v')
        .populate(
            {
                path: 'createdBy updatedBy',
                select: 'name'
            }
        )
        .lean();

    if (result) {
        res.status(200).json({ message: 'ISP updated Successfully', updated: result });
    } else {
        res.status(400);
        throw new Error('Error updating ISP');
    }
})

// @desc    Update ISP
// @route   PUT /isp/status/:id
// @access  Private - authMiddleware
const updateIspStatus = asyncHandler(async (req, res) => {
    const isExists = await ISP.findById(req.params.id).lean();

    if (!isExists) {
        res.status(400);
        throw new Error('ISP not found');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active';

    const updatedIspStatus = await ISP.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                status: statusCondition,
                updatedBy: req.user.id
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
        if (total > 0) {
            res.status(400);
            throw new Error(`Please remove this ISP from the ${total} Internet services, and try again`)
        }
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