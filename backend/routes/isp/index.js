const router = require('express').Router();
const {
    removeISP,
    addNewIsp,
    updateIsp,
    getAllIsp,
    getSpecificIsp,
    updateIspStatus
} = require('../../controllers/isp');
const auth = require('../../middleware/auth');

// routes: 6

// @desc    Get all ISP
// @route   GET /isp
// @access  Private - authMiddleware
router.get('/', auth, getAllIsp);

// @desc    Get specific ISP
// @route   GET /isp/:id
// @access  Private - (authMiddleware, authMiddleware)
router.get('/:id', auth, getSpecificIsp);

// @desc    Add New ISP
// @route   POST /isp
// @access  Private - (authMiddleware, authMiddleware)
router.post('/', auth, addNewIsp);

// @desc    Update ISP
// @route   PUT /isp/:id
// @access  Private - (authMiddleware, authMiddleware)
router.put('/:id', auth, updateIsp);

// @desc    Update ISP
// @route   PUT /isp/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateIspStatus);

// @desc    Delete ISP
// @route   DELETE /isp/:id
// @access  Private - (authMiddleware, authMiddleware)
router.delete('/:id', auth, removeISP);

module.exports = router