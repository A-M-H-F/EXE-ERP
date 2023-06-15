const asyncHandler = require('express-async-handler');
const Customer = require('../../models/customerModel');

// @desc    Get all customers
// @route   GET /customer
// @access  Private - authMiddleware
const getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find().lean();

    if (customers) {
        res.status(200).json(customers);
    } else {
        res.status(400);
        throw new Error('Error getting customers');
    }
})

// @desc    Get all active customers
// @route   GET /customer/active
// @access  Private - authMiddleware
const getActiveCustomers = asyncHandler(async (req, res) => {
    const activeCustomers = await Customer.find({ status: 'active' }).lean();

    if (activeCustomers) {
        res.status(200).json(activeCustomers);
    } else {
        res.status(400);
        throw new Error('Error getting active customers');
    }
})

// @desc    Get all inactive customers
// @route   GET /customer/inactive
// @access  Private - authMiddleware
const getInActiveCustomers = asyncHandler(async (req, res) => {
    const inactiveCustomers = await Customer.find({ status: 'inactive' }).lean();

    if (inactiveCustomers) {
        res.status(200).json(inactiveCustomers);
    } else {
        res.status(400);
        throw new Error('Error getting inactive customers');
    }
})

// @desc    Get specific customer
// @route   GET /customer/:id
// @access  Private - authMiddleware
const getSpecificCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id).lean();

    if (customer) {
        res.status(200).json(customer);
    } else {
        res.status(400);
        throw new Error('Error getting customer')
    }
})

// @desc    Add new customer
// @route   POST /customer
// @access  Private - authMiddleware
const addNewCustomer = asyncHandler(async (req, res) => {
    const {
        fullName,
        phoneNumber,
        additionalPhoneNumbers,
        address,
        coordinates,
        macAddress,
        ipAddress,
        subscriptionDate
    } = req.body;

    if (!fullName || !phoneNumber || !address) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isExists = await Customer.find(
        {
            fullName
        }
    );

    if (isExists) {
        res.status(400);
        throw new Error('Please choose a unique name');
    }

    const newCustomer = await Customer.create(
        {
            fullName,
            phoneNumber,
            additionalPhoneNumbers,
            address,
            coordinates,
            macAddress,
            ipAddress,
            subscriptionDate
        }
    );

    if (newCustomer) {
        res.status(200).json({ message: 'Customer added  successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new customer, try again');
    }
})

// @desc    Update Customer
// @route   PUT /customer/:id
// @access  Private - authMiddleware
const updateCustomer = asyncHandler(async (req, res) => {
    const {
        fullName,
        phoneNumber,
        additionalPhoneNumbers,
        address,
        coordinates,
        macAddress,
        ipAddress
    } = req.body

    if (!fullName || !phoneNumber || address) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const checkCustomer = await Customer.findById(req.params.id);

    if (!checkCustomer) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const isExists = await Customer.findOne(
        {
            _id: { $ne: req.params.id },
            fullName
        }
    );

    if (isExists) {
        res.status(400);
        throw new Error('Please choose a unique name');
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                fullName,
                phoneNumber,
                additionalPhoneNumbers,
                address,
                coordinates,
                macAddress,
                ipAddress
            }
        }
    );

    if (updatedCustomer) {
        res.status(200).json({ message: 'Customer updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating customer');
    }
})

// @desc    Activate/Deactivate Customer
// @route   PUT /customer/status/:id
// @access  Private - authMiddleware
const updateCustomerStatus = asyncHandler(async (req, res) => {
    const isExists = await Customer.findById(req.params.id).lean();

    if (!isExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active';

    const updateStatus = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (updateStatus) {
        res.status(200).json({ message: `Customer status changed to ${statusCondition}` })
    } else {
        res.status(400);
        throw new Error('Error updating customer status');
    }
})

module.exports = {
    getAllCustomers,
    getActiveCustomers,
    getInActiveCustomers,
    getSpecificCustomer,
    addNewCustomer,
    updateCustomer,
    updateCustomerStatus
}