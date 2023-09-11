const asyncHandler = require('express-async-handler');
const Customer = require('../../models/customerModel');
const SubscriptionHistory = require('../../models/subscriptionHistoryModel');
const InternetService = require('../../models/internetServiceModel');
const path = require('path');
const fs = require('fs');

// @desc    Get all customers
// @route   GET /customer
// @access  Private - authMiddleware
const getAllCustomers = asyncHandler(async (req, res) => {
    const result = await Customer.find().sort({ createdAt: -1 })
        .select('-__v')
        .populate(
            {
                path: 'service',
                select: 'service'
            }
        )
        .populate(
            {
                path: 'createdBy updatedBy',
                select: 'name'
            }
        )
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting customers');
    }
})

// @desc    Get active customers
// @route   GET /customer/active
// @access  Private - authMiddleware
const getActiveCustomers = asyncHandler(async (req, res) => {
    const result = await Customer.find()
        .select('fullName arabicName phoneNumber accountName')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting customers');
    }
})

// @desc    Get specific customer
// @route   GET /customer/:id
// @access  Private - authMiddleware
const getSpecificCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id)
        .select('-__v')
        .populate(
            {
                path: 'service',
                select: 'service'
            }
        )
        .populate(
            {
                path: 'createdBy updatedBy',
                select: 'name'
            }
        )
        .lean();

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
const addNewCustomer = asyncHandler(async (req, res, next) => {
    const {
        fullName,
        arabicName,
        phoneNumber,
        additionalPhoneNumbers,
        address,
        coordinates,
        macAddress,
        ipAddress,
        subscriptionDate,
        moreInfo,
        service,
        accountName
    } = req.query;

    if (!fullName || !arabicName || !phoneNumber || !address || !macAddress || !ipAddress || !subscriptionDate) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (service && !accountName) {
        res.status(400);
        throw new Error('Please add an account name');
    }

    const matchedFields = [];

    if (service) {
        const result = await Customer.findOne({ accountName });
        if (result) {
            matchedFields.push('Account Name');
        }
    }

    const customerWithFullName = await Customer.findOne({ fullName });
    if (customerWithFullName) {
        matchedFields.push('Full Name');
    }

    const customerWithMacAddress = await Customer.findOne({ macAddress });
    if (customerWithMacAddress) {
        matchedFields.push('Mac Address');
    }

    const customerWithIpAddress = await Customer.findOne({ ipAddress });
    if (customerWithIpAddress) {
        matchedFields.push('Ip Address');
    }

    const customerWithArabicName = await Customer.findOne({ arabicName });
    if (customerWithArabicName) {
        matchedFields.push('Arabic Name');
    }

    const customerWithLatitudeLongitude = await Customer.findOne({
        'coordinates.latitude': coordinates.latitude,
        'coordinates.longitude': coordinates.longitude
    });
    if (customerWithLatitudeLongitude) {
        matchedFields.push('Coordinates');
    }

    if (matchedFields.length > 0) {
        const errorMessage = `The following fields already exist for a different customer: : ${matchedFields.join(', ')}`;
        res.status(400);
        throw new Error(errorMessage);
    }

    const newCustomer = await new Customer(
        {
            fullName,
            arabicName,
            phoneNumber,
            additionalPhoneNumbers,
            address,
            coordinates,
            macAddress,
            ipAddress,
            subscriptionDate,
            moreInfo,
            createdBy: req.user.id
        }
    );

    if (!newCustomer) {
        res.status(400);
        throw new Error('Error adding new customer, try again');
    }

    if (service && service !== '') {
        newCustomer.service = service
        newCustomer.accountName = accountName
    }

    await newCustomer.save()

    req.newCustomer = newCustomer;
    req.params.id = req.newCustomer._id;

    next();
})

// @desc    Update Customer
// @route   PUT /customer/:id
// @access  Private - authMiddleware
const updateCustomer = asyncHandler(async (req, res) => {
    const {
        fullName,
        arabicName,
        phoneNumber,
        additionalPhoneNumbers,
        address,
        coordinates,
        macAddress,
        ipAddress,
        moreInfo,
        service,
        accountName
    } = req.body

    if (!fullName || !arabicName || !phoneNumber || !address || !macAddress || !ipAddress) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (service && !accountName) {
        res.status(400);
        throw new Error('Please add an account number');
    }

    const checkCustomer = await Customer.findById(req.params.id);
    if (!checkCustomer) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const matchedFields = [];

    if (service) {
        const result = await Customer.findOne({
            _id: { $ne: req.params.id },
            accountName
        });
        if (result) {
            matchedFields.push('Account Name');
        }
    }

    const customerWithFullName = await Customer.findOne({
        _id: { $ne: req.params.id },
        fullName
    });

    if (customerWithFullName) {
        matchedFields.push('fullName');
    }

    const customerWithMacAddress = await Customer.findOne({
        _id: { $ne: req.params.id },
        macAddress
    });

    if (customerWithMacAddress) {
        matchedFields.push('macAddress');
    }

    const customerWithIpAddress = await Customer.findOne({
        _id: { $ne: req.params.id },
        ipAddress
    });

    if (customerWithIpAddress) {
        matchedFields.push('ipAddress');
    }

    const customerWithArabicName = await Customer.findOne({
        _id: { $ne: req.params.id },
        arabicName
    });

    if (customerWithArabicName) {
        matchedFields.push('arabicName');
    }

    const customerWithLatitudeLongitude = await Customer.findOne({
        _id: { $ne: req.params.id },
        'coordinates.latitude': coordinates.latitude,
        'coordinates.longitude': coordinates.longitude
    });

    if (customerWithLatitudeLongitude) {
        matchedFields.push('coordinates');
    }

    if (matchedFields.length > 0) {
        const errorMessage = `The following fields already exist for a different customer: ${matchedFields.join(', ')}`;
        res.status(400);
        throw new Error(errorMessage);
    }

    if (service && service !== '') {
        await Customer.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    service,
                    accountName
                }
            }
        )

        if (checkCustomer.service && service !== String(checkCustomer.service)) {
            const serviceHistory = await SubscriptionHistory.findOne({ customer: req.params.id })
            const addOldSubToHistory = {
                service: checkCustomer.service,
                changedBy: req.user.id,
                changeDate: new Date(),
            };
    
            if (serviceHistory) {
                await SubscriptionHistory.findByIdAndUpdate(
                    serviceHistory._id,
                    {
                        $push: {
                            serviceHistory: addOldSubToHistory
                        },
                        $set: {
                            updatedBy: req.user.id
                        }
                    }
                )
            } else {
                await SubscriptionHistory.create({
                    serviceHistory: [addOldSubToHistory],
                    customer: req.params.id,
                    createdBy: req.user.id
                })
            }
        }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                fullName,
                arabicName,
                phoneNumber,
                additionalPhoneNumbers,
                address: {
                    ...checkCustomer.address,
                    address
                },
                coordinates,
                macAddress,
                ipAddress,
                moreInfo,
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
                path: 'service',
                select: 'service'
            }
        )
        .populate(
            {
                path: 'createdBy updatedBy',
                select: 'name'
            }
        )
        .lean();

    if (updatedCustomer) {
        res.status(200).json({ message: 'Customer updated successfully', result: updatedCustomer });
    } else {
        res.status(400);
        throw new Error('Error updating customer');
    }
})

// @desc    Change customer subscription service
// @route   PUT /customer/subscription/:id
// @access  Private - authMiddleware
const changeCustomerSubscriptionService = asyncHandler(async (req, res) => {
    const { service } = req.body;

    if (!service) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isCustomerExists = await Customer.findById(req.params.id)
    if (!isCustomerExists) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const isInternetServiceExists = await InternetService.findById(service);
    if (!isInternetServiceExists) {
        res.status(400);
        throw new Error('Internet service not found');
    }

    if (isCustomerExists.service === service) {
        res.status(400);
        throw new Error('Service Already set');
    }

    const serviceHistory = await SubscriptionHistory.findOne({ customer: req.params.id })

    if (isCustomerExists.service) {
        const addOldSubToHistory = {
            service: isCustomerExists.service,
            changedBy: req.user.id,
            changeDate: new Date(),
        };

        if (serviceHistory) {
            await SubscriptionHistory.findByIdAndUpdate(
                serviceHistory._id,
                {
                    $push: {
                        serviceHistory: addOldSubToHistory
                    },
                    $set: {
                        updatedBy: req.user.id
                    }
                }
            )
        } else {
            await SubscriptionHistory.create({
                serviceHistory: [addOldSubToHistory],
                customer: req.params.id,
                createdBy: req.user.id
            })
        }
    }

    const result = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                service
            }
        }
    )

    if (result) {
        res.status(200).json({ message: 'Customer service changed successfully', serviceName: isInternetServiceExists.name });
    } else {
        res.status('400');
        throw new Error('Error changing customer service');
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
                status: statusCondition,
                updatedBy: req.user.id
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

// @desc    Upload customer building image
// @route   PUT /customer/building/image/:id
// @access  Private - authMiddleware
const updateCustomerBuildingImage = asyncHandler(async (req, res) => {
    const customerId = req.params.id;

    if (!req.file) {
        res.status(400);
        throw new Error('No picture uploaded');
    }

    if (!req.params.id) {
        res.status(400);
        throw new Error('Please try again');
    }

    const getCustomer = await Customer.findById(customerId).lean();
    if (!getCustomer) {
        res.status(400);
        throw new Error('Customer not found');
    }

    const filePath = req.file.path.replace('public', '').replace(/\\/g, '/');

    if (getCustomer.address.buildingImage && getCustomer.address.buildingImage !== '') {
        const imagePath = getCustomer.address.buildingImage
        const absoluteImagePath = path.join(__dirname, '..', '..', 'public', imagePath);
        fs.unlink(absoluteImagePath, (err) => {
            if (err) {
                // console.error('Error deleting image:', err);
            } else {
                // console.log('Image deleted successfully:', absoluteImagePath);
            }
        });
    }

    const result = await Customer.findByIdAndUpdate(
        customerId,
        {
            $set: {
                'address.buildingImage': filePath
            }
        }
    )

    if (result) {
        res.status(200).json({ message: 'Customer building image updated successfully', picPath: filePath });
    } else {
        res.status(400);
        throw new Error('Error updating customer building image');
    }
})

const handleNewCustomerBPic = asyncHandler(async (req, res, next) => {
    const customerId = req.params.id;

    if (req.file) {
        const filePath = req.file.path.replace('public', '').replace(/\\/g, '/');

        await Customer.findByIdAndUpdate(
            customerId,
            {
                $set: {
                    'address.buildingImage': filePath
                }
            }
        )
    }

    const result = await Customer.findById(customerId)
        .select('-__v')
        .populate(
            {
                path: 'service',
                select: 'service'
            }
        )
        .populate(
            {
                path: 'createdBy updatedBy',
                select: 'name'
            }
        )
        .lean()

    if (result) {
        res.status(200).json({ message: 'Customer added  successfully', result });
    } else {
        res.status(400);
        throw new Error('Error, try again');
    }
})

module.exports = {
    getAllCustomers,
    getSpecificCustomer,
    addNewCustomer,
    updateCustomer,
    updateCustomerStatus,
    handleNewCustomerBPic,
    updateCustomerBuildingImage,
    getActiveCustomers,
    changeCustomerSubscriptionService
}