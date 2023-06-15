const router = require('express').Router();
const {
    getAllProductInventory,
    getProductInventoryInfo,
    getInventoryByProduct,
    getProductInventoryByStatus,
    getProductInventoryByBoxStatus,
    addNewProductToInventory,
    updateProductStatusInInventory,
    updateProductInInventory,
    removeProductFromInventory,
    addNewProductToInventoryAsBox,
    updateProductInInventoryAsBox
} = require('../../controllers/productInventory');
const auth = require('../../middleware/auth');

// routes: 11

// @desc    Get all product inventory
// @route   GET /product-inventory
// @access  Private - authMiddleware
router.get('/', auth, getAllProductInventory);

// @desc    Get product inventory info
// @route   GET /product-inventory/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getProductInventoryInfo);

// @desc    Get product inventory by status
// @route   GET /product-inventory/status/:id
// @access  Private - authMiddleware
router.get('/status/:id', auth, getProductInventoryByStatus);

// @desc    Get product inventory by product
// @route   GET /product-inventory/product/:id
// @access  Private - authMiddleware
router.get('/product/:id', auth, getInventoryByProduct);

// @desc    Get product inventory by (isBox = ['true', 'false'])
// @route   GET /product-inventory/box/:id
// @access  Private - authMiddleware
router.get('/box/:id', auth, getProductInventoryByBoxStatus);

// @desc    Add new product to inventory
// @route   POST /product-inventory
// @access  Private - authMiddleware
router.post('/', auth, addNewProductToInventory);

// @desc    Add new product to inventory as Box
// @route   POST /product-inventory/box
// @access  Private - authMiddleware
router.post('/box', auth, addNewProductToInventoryAsBox);

// @desc    Update product status inside inventory
// @route   PUT /product-inventory/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateProductStatusInInventory);

// @desc    Update product inside inventory
// @route   PUT /product-inventory/:id
// @access  Private - authMiddleware
router.put('/:id', auth, updateProductInInventory);

// @desc    Update product inside inventory as box
// @route   PUT /product-inventory/box/:id
// @access  Private - authMiddleware
router.put('/box/:id', auth, updateProductInInventoryAsBox);

// @desc    Remove product from inventory
// @route   DELETE /product-inventory/:id
// @access  Private - authMiddleware
router.delete('/:id', auth, removeProductFromInventory);

module.exports = router;