const asyncHandler = require('express-async-handler');
const Product = require('../../models/productModel');
const ProductInventory = require('../../models/productInventoryModel');

// @desc    Get All products
// @route   GET /product
// @access  Private - authMiddleware
const getAllProducts = asyncHandler(async (req, res) => {
    const result = await Product.find().lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting all products');
    }
})

// @desc    Get specific product info
// @route   GET /product/:id
// @access  Private - authMiddleware
const getSpecificProductInfo = asyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Error, try again');
    }

    const result = await Product.findById(req.params.id).lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting product info');
    }
})

// @desc    Get products by status
// @route   GET /product/status/:id
// @access  Private - authMiddleware
const getProductsByStatus = asyncHandler(async (req, res) => {
    if (!req.params.id || !['active', 'inactive'].includes(req.params.id)) {
        res.status(400);
        throw new Error('Error, please try again');
    }

    const result = await Product.find(
        {
            status: req.params.id,
        }
    ).lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error(`Error getting ${req.params.id} products`);
    }
})

// @desc    Add new product
// @route   POST /product
// @access  Private - authMiddleware
const addNewProduct = asyncHandler(async (req, res) => {
    const {
        name,
        brand
    } = req.body;

    if (!name || !brand) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const checkDuplicate = await Product.findOne(
        {
            $and: [
                { name },
                { brand }
            ]
        }
    );

    if (checkDuplicate) {
        res.status(400);
        throw new Error('Product already exists');
    }

    const newProduct = await Product.create(
        {
            name,
            brand,
            addedBy: req.user.id
        }
    );

    if (newProduct) {
        res.status(200).json({ message: 'New product added successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new product, please try again');
    }
})

// @desc    Update product status
// @route   PUT /product/status/:id
// @access  Private - authMiddleware
const updateProductStatus = asyncHandler(async (req, res) => {
    const isProductExists = await Product.findById(req.params.id);

    if (!isProductExists) {
        res.status(400);
        throw new Error('Product not found');
    }

    const statusCondition = isProductExists.status === 'active' ? 'inactive' : 'active';

    const result = await Product.findByIdAndUpdate(
        isProductExists._id,
        {
            $set: {
                status: statusCondition,
                updatedBy: req.user.id
            }
        }
    );

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error updating product status');
    }
})

// @desc    Update product
// @route   PUT /product/:id
// @access  Private - authMiddleware
const updateProduct = asyncHandler(async (req, res) => {
    const {
        name,
        brand
    } = req.body;

    if (!name || !brand || !req.params.id) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isProductExists = await Product.findById(req.params.id);

    if (!isProductExists) {
        res.status(400);
        throw new Error('Product not found');
    }

    const checkDuplicate = await Product.findOne(
        {
            $and: [
                { name },
                { brand }
            ]
        }
    );

    if (checkDuplicate) {
        res.status(400);
        throw new Error('Product already exists, check duplicates');
    }

    const result = await Product.findByIdAndUpdate(
        isProductExists._id,
        {
            $set: {
                name,
                brand,
                updatedBy: req.user.id
            }
        }
    );

    if (result) {
        res.status(200).json({ message: 'Product updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating product');
    }
})

// @desc    Remove product
// @route   DELETE /product/:id
// @access  Private - authMiddleware
const removeProduct = asyncHandler(async (req, res) => {
    const isExists = await Product.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Product not found');
    }

    const checkInventory = await ProductInventory.find(
        {
            asset: isExists._id
        }
    )

    if (checkInventory) {
        const total = checkInventory.length;

        res.status(400);
        throw new Error(`Please remove this product from inventory first, you have ${total} products inside inventory`);
    }

    const remove = await Asset.findByIdAndDelete(req.params.id);

    if (remove) {
        res.status(200).json({ message: 'Product deleted successfully ' });
    } else {
        res.status(400);
        throw new Error('Error deleting product');
    }
})

module.exports = {
    getAllProducts,
    getSpecificProductInfo,
    getProductsByStatus,
    addNewProduct,
    updateProductStatus,
    updateProduct,
    removeProduct
}