const asyncHandler = require('express-async-handler');
const ISP = require('../../models/ispModel');
const InternetService = require('../../models/internetServiceModel');

// @desc    Get All internet services
// @route   GET /internet-service
// @access  Private - authMiddleware
const getAllInternetServices = asyncHandler(async (req, res) => {
    const result = await InternetService.find()
        .populate(
            {
                path: 'createdBy updatedBy isp',
                select: 'name'
            }
        )
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting Internet Services');
    }
})

// @desc    Get All active internet services
// @route   GET /internet-service/active
// @access  Private - authMiddleware
const getActiveInternetServices = asyncHandler(async (req, res) => {
    const result = await InternetService.find({ status: 'active' })
        .select('service')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting Internet Services');
    }
})

// @desc    Get Specific services
// @route   GET /internet-service/:id
// @access  Private - authMiddleware
const getSpecificIS = asyncHandler(async (req, res) => {
    const result = await InternetService.findById(req.params.id)
        .populate(
            {
                path: 'createdBy updatedBy isp',
                select: 'name'
            }
        )
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting Internet service info');
    }
})

// @desc    Add new internet service
// @route   POST /internet-service
// @access  Private - authMiddleware
const addNewInternetService = asyncHandler(async (req, res) => {
    const {
        name,
        isp,
        service,
        cost,
        price,
        moreInfo
    } = req.body;

    if (!name || !isp || !service || !cost || !price) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (price < cost) {
        res.status(400)
        throw new Error('Price should be greater/equal to the cost');
    }

    const checkISP = await ISP.findById(isp);
    if (!checkISP) {
        res.status(400);
        throw new Error('ISP not found');
    }

    const checkUnique = await InternetService.findOne(
        {
            service
        }
    );
    if (checkUnique) {
        res.status(400);
        throw new Error('Please add a unique service name');
    }

    const newIS = await InternetService.create({
        name,
        isp,
        service,
        price,
        cost,
        moreInfo,
        createdBy: req.user.id,
        profit: price - cost,
    })

    const newInternetService = await InternetService.findById(newIS._id)
        .populate(
            {
                path: 'createdBy updatedBy isp',
                select: 'name'
            }
        )
        .lean();

    if (newIS) {
        res.status(200).json({ message: 'New internet service added successfully', newInternetService });
    } else {
        res.status(400);
        throw new Error('Error adding new internet service');
    }
})

// @desc    Update  internet service
// @route   PUT /internet-service/:id
// @access  Private - authMiddleware
const updateInternetService = asyncHandler(async (req, res) => {
    const {
        name,
        isp,
        service,
        cost,
        price,
        moreInfo
    } = req.body;

    if (!name || !isp || !service || !cost || !price) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (price < cost) {
        res.status(400)
        throw new Error('Price should be greater/equal to the cost');
    }

    const isExists = await InternetService.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('Internet Service not found');
    }


    const checkISP = await ISP.findById(isp);
    if (!checkISP) {
        res.status(400);
        throw new Error('ISP not found');
    }

    const checkUnique = await InternetService.findOne(
        {
            _id: { $ne: req.params.id },
            service: service
        }
    );
    if (checkUnique) {
        res.status(400);
        throw new Error('Please add a unique service name');
    }

    const update = await InternetService.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name,
                isp,
                service,
                cost,
                price,
                moreInfo,
                updatedBy: req.user.id,
                profit: price - cost,
            }
        },
        {
            new: true
        }
    ).populate(
        {
            path: 'createdBy updatedBy isp',
            select: 'name'
        }
    )
        .lean();

    if (update) {
        res.status(200).json({ message: 'Internet Service updated successfully', newInternetService: update });
    } else {
        res.status(400);
        throw new Error('Error updating internet service');
    }
})

// @desc    Update internet service status
// @route   PUT /internet-service/status/:id
// @access  Private - authMiddleware
const updateInternetServiceStatus = asyncHandler(async (req, res) => {
    const isExists = await InternetService.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Internet service not found');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active';

    const updateStatus = await InternetService.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (updateStatus) {
        res.status(200).json({
            message: `Internet service status updated to ${statusCondition}`,
        });
    } else {
        res.status(400);
        throw new Error('Error updating internet service status');
    }
})

// @desc    Update internet service isp
// @route   PUT /internet-service/isp/:id
// @access  Private - authMiddleware
const updateInternetServiceISP = asyncHandler(async (req, res) => {
    const { isp } = req.body

    if (!isp) {
        res.status(400);
        throw new Error('Please select isp');
    }

    const checkISP = await ISP.findById(isp);
    if (!checkISP) {
        res.status(400);
        throw new Error('ISP not found');
    }


    const isExists = await InternetService.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Internet service not found');
    }

    const result = await InternetService.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                isp: isp
            }
        }
    );

    if (result) {
        res.status(200).json({
            message: `Internet service isp updated successfully`,
        });
    } else {
        res.status(400);
        throw new Error('Error updating internet service isp');
    }
})

module.exports = {
    getAllInternetServices,
    getActiveInternetServices,
    getSpecificIS,
    addNewInternetService,
    updateInternetService,
    updateInternetServiceStatus,
    updateInternetServiceISP,
}