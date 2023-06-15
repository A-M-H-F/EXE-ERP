const asyncHandler = require('express-async-handler');
const Product = require('../../models/productModel');
const ProductInventory = require('../../models/productInventoryModel');

// @desc    Get all product inventory
// @route   GET /product-inventory
// @access  Private - authMiddleware
const getAllProductInventory = asyncHandler(async (req, res) => {
    const result = await ProductInventory.find().lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting products inventory');
    }
})

// @desc    Get product inventory info
// @route   GET /product-inventory/:id
// @access  Private - authMiddleware
const getProductInventoryInfo = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, please try again');
    }

    const result = await ProductInventory.findById(req.params.id)
        .populate('product')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting product info from inventory');
    }
})

// @desc    Get product inventory by status
// @route   GET /product-inventory/status/:id
// @access  Private - authMiddleware
const getProductInventoryByStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || !['new', 'used', 'damaged'].includes(req.params.id)) {
        res.status(400);
        throw new Error('Error, please try again');
    }

    const result = await ProductInventory.find(
        {
            status: req.params.id
        }
    ).populate('product').lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting product inventory by status');
    }
})

// @desc    Get product inventory by product
// @route   GET /product-inventory/product/:id
// @access  Private - authMiddleware
const getInventoryByProduct = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const isProductExists = await Product.findById(req.params.id);

    if (!isProductExists) {
        res.status(400);
        throw new Error('Product not found');
    }

    const result = await ProductInventory.find(
        {
            product: isProductExists._id
        }
    ).lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting products');
    }
})

// @desc    Get product inventory by (isBox = ['true', 'false'])
// @route   GET /product-inventory/box/:id
// @access  Private - authMiddleware
const getProductInventoryByBoxStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || ![true, false].includes(req.params.id)) {
        res.status(400);
        throw new Error('Error, please try again');
    }

    const result = await ProductInventory.find(
        {
            isBox: req.params.id
        }
    ).populate('product').lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting products by box status');
    }
})

// @desc    Add new product to inventory
// @route   POST /product-inventory
// @access  Private - authMiddleware
const addNewProductToInventory = asyncHandler(async (req, res) => {
    const {
        product,
        serialNumber,
        modelNumber,
        price,
        cost,
        quantity,
        status,
        description,
        notes,
    } = req.body;

    if (!product || !serialNumber || !status || !quantity) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isProductExists = await Product.findById(product);
    if (!isProductExists) {
        res.status(400);
        throw new Error('Product not found');
    }

    const checkSerialNumber = await ProductInventory.findOne(
        {
            serialNumber
        }
    );
    if (checkSerialNumber) {
        res.status(400);
        throw new Error('Please check serial number, serial number exists exists');
    }

    const result = await ProductInventory.create(
        {
            product,
            serialNumber,
            status,
            modelNumber,
            price,
            cost,
            quantity,
            description,
            notes,
            addedBy: req.user.id
        }
    );

    if (result) {
        res.status(200).json({ message: 'New product added to inventory successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new product to inventory');
    }
})

// @desc    Add new product to inventory as Box
// @route   POST /product-inventory/box
// @access  Private - authMiddleware
const addNewProductToInventoryAsBox = asyncHandler(async (req, res) => {
    const {
        product,
        serialNumber,
        modelNumber,
        price,
        cost,
        quantity,
        status,
        description,
        notes,
        boxes,
        box,
    } = req.body;

    if (!product || !serialNumber || !status || !quantity || !boxes || !box || typeof box !== 'object') {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (!product || !serialNumber || !status || !quantity) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isProductExists = await Product.findById(product);
    if (!isProductExists) {
        res.status(400);
        throw new Error('Product not found');
    }

    const checkSerialNumber = await ProductInventory.findOne(
        {
            serialNumber
        }
    );
    if (checkSerialNumber) {
        res.status(400);
        throw new Error('Please check serial number, serial number exists exists');
    }

    const result = await ProductInventory.create(
        {
            product,
            serialNumber,
            modelNumber,
            price,
            cost,
            quantity,
            status,
            description,
            notes,
            boxes,
            box,
            addedBy: req.user.id,
            isBox: true
        }
    );

    if (result) {
        res.status(200).json({ message: 'New product added to inventory successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new product to inventory');
    }
})

// @desc    Update product status inside inventory
// @route   PUT /product-inventory/status/:id
// @access  Private - authMiddleware
const updateProductStatusInInventory = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!req.params.id || !status || !['new', 'used', 'damaged'].includes(status)) {
        res.status(400);
        throw new Error('Error, please try again');
    }

    const isExists = await ProductInventory.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('Product not found');
    }

    if (isExists.status === status) {
        res.status(400);
        throw new Error(`Already the status is ${status}`);
    }

    const result = await ProductInventory.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                status: status
            }
        }
    );

    if (result) {
        res.status(200).json({ message: `Product status updated to ${status}` });
    } else {
        res.status(400);
        throw new Error('Error updating product status');
    }
})

// @desc    Update product inside inventory
// @route   PUT /product-inventory/:id
// @access  Private - authMiddleware
const updateProductInInventory = asyncHandler(async (req, res) => {

})

// @desc    Update product inside inventory as box
// @route   PUT /product-inventory/box/:id
// @access  Private - authMiddleware
const updateProductInInventoryAsBox = asyncHandler(async (req, res) => {

})

// @desc    Remove product from inventory
// @route   DELETE /product-inventory/:id
// @access  Private - authMiddleware
const removeProductFromInventory = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, please try again');
    }

    const isExists = await ProductInventory.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Product not found');
    }

    const remove = await ProductInventory.findByIdAndDelete(req.params.id);

    if (remove) {
        res.status(200).json({ message: 'Product removed from inventory successfully' });
    } else {
        res.status(400);
        throw new Error('Error removing product from inventory');
    }
})

module.exports = {
    getAllProductInventory,
    getProductInventoryInfo,
    getProductInventoryByStatus,
    getInventoryByProduct,
    getProductInventoryByBoxStatus,
    addNewProductToInventory,
    addNewProductToInventoryAsBox,
    updateProductStatusInInventory,
    updateProductInInventory,
    updateProductInInventoryAsBox,
    removeProductFromInventory,
}
