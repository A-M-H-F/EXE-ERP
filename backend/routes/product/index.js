const router = require('express').Router();
const {
    getAllProducts, 
    getSpecificProductInfo,
    getProductsByStatus,
    addNewProduct,
    updateProductStatus,
    updateProduct,
    removeProduct,
} = require('../../controllers/product');
const auth = require('../../middleware/auth');

// routes: 7

// @desc    Get All products
// @route   GET /product
// @access  Private - authMiddleware
router.get('/', auth, getAllProducts);

// @desc    Get specific product info
// @route   GET /product/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificProductInfo);

// @desc    Get products by status
// @route   GET /product/status/:id
// @access  Private - authMiddleware
router.get('/status/:id', auth, getProductsByStatus);

// @desc    Add new product
// @route   POST /product
// @access  Private - authMiddleware
router.post('/', auth, addNewProduct);

// @desc    Update product status
// @route   PUT /product/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateProductStatus);

// @desc    Update product
// @route   PUT /product/:id
// @access  Private - authMiddleware
router.put('/:id', auth, updateProduct);

// @desc    Remove product
// @route   DELETE /product/:id
// @access  Private - authMiddleware
router.delete('/:id', auth, removeProduct)

module.exports = router;
