const asyncHandler = require('express-async-handler');
const Service = require('../../models/serviceModel');

// @desc    Get All Services
// @route   GET /service
// @access  Private - authMiddleware
const getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.find().lean();

    if (services) {
        res.status(200).json(services);
    } else {
        res.status(400);
        throw new Error('Error getting services');
    }
})

// @desc    Get active Services
// @route   GET /service/active
// @access  Private - authMiddleware
const getActiveServices = asyncHandler(async (req, res) => {
    const activeServices = await Service.find({ status: 'active' }).lean();

    if (activeServices) {
        res.status(200).json(activeServices);
    } else {
        res.status(400);
        throw new Error('Error getting active services');
    }
})

// @desc    Get inactive Services
// @route   GET /service/inactive
// @access  Private - authMiddleware
const getInactiveServices = asyncHandler(async (req, res) => {
    const inactiveServices = await Service.find({ status: 'inactive' }).lean();

    if (inactiveServices) {
        res.status(200).json(inactiveServices);
    } else {
        res.status(400);
        throw new Error('Error getting inactive services');
    }
})

// @desc    Add new Service
// @route   PosT /service
// @access  Private - authMiddleware
const addNewService = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        details
    } = req.body;

    if (!name || !price) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const checkDuplicates = await Service.find(
        {
            name
        }
    );

    if (checkDuplicates) {
        res.status(400);
        throw new Error('Please choose a unique name, and try again');
    }

    const newService = await Service.create(
        {
            name,
            price,
            details
        }
    );

    if (newService) {
        res.status(200).json({ message: 'New service added successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new service');
    }
})

// @desc    Update Service
// @route   PUT /service/:id
// @access  Private - authMiddleware
const updateService = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        details
    } = req.body;

    if (!name || !price) {
        res.status(400); 
        throw new Error('Please check all fields');
    }

    const isExists = await Service.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Service not found');
    }

    const checkDuplicates = await Service.find(
        {
            _id: { $ne: req.params.id },
            name
        }
    );

    if (checkDuplicates) {
        res.status(400);
        throw new Error('Please choose a unique name');
    }

    const updatedService = await Service.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                name,
                price,
                details
            }
        }
    );

    if (updatedService) {
        res.status(200).json({ message: 'Service updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating service');
    }
})

// @desc    Update Service status
// @route   PUT /service/status/:id
// @access  Private - authMiddleware
const updateServiceStatus = asyncHandler(async (req, res) => {
    const isExists = await Service.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Service not found');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active';

    const updatedStatus = await Service.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (updatedStatus) {
        res.status(200).json({ message: `Service status updated to ${statusCondition}` });
    } else {
        res.status(400);
        throw new Error('Error updating service status');
    }
})

module.exports = {
    getAllServices,
    getActiveServices,
    getInactiveServices,
    addNewService,
    updateService,
    updateServiceStatus
}