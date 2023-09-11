const router = require('express').Router();
const {
    createBoard,
    getSpecificBoard,
    getAllBoards,
    updateBoardsPosition,
    updateBoardFavoritePosition,
    getFavoriteBoards,
    updateBoardTitle,
    updateBoardDescription,
    updateBoardIcon,
    updateBoardStatus,
    deleteBoard,
    updateBoardUsers
} = require('../../controllers/scrumBoard');
const auth = require('../../middleware/auth');

// route = 13

// @desc    Get All Boards
// @route   GET /boards
// @access  Private - authMiddleware
router.get('/', auth, getAllBoards);

// @desc    Get specific board
// @route   GET /boards/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getSpecificBoard);

// @desc    Get Favorite boards
// @route   GET /boards/status/favorite
// @access  Private - authMiddleware
router.get('/status/favorite', auth, getFavoriteBoards);

// @desc    Create Board
// @route   POST /boards
// @access  Private - authMiddleware
router.post('/', auth, createBoard);

// @desc    Update Boards position
// @route   PUT /boards/position
// @access  Private - authMiddleware
router.put('/position', auth, updateBoardsPosition);

// @desc    Update Boards favorite position
// @route   PUT /boards/favoritePosition
// @access  Private - authMiddleware
router.put('/favoritePosition', auth, updateBoardFavoritePosition);

// @desc    Update board users
// @route   PUT /boards/user/update/:id
// @access  Private - authMiddleware
router.put('/user/update/:id', auth, updateBoardUsers);

// @desc    Update Board title
// @route   PUT /boards/title/:id
// @access  Private - authMiddleware
router.put('/title/:id', auth, updateBoardTitle);

// @desc    Update Board description
// @route   PUT /boards/description/:id
// @access  Private - authMiddleware
router.put('/description/:id', auth, updateBoardDescription);

// @desc    Update Board icon
// @route   PUT /boards/icon/:id
// @access  Private - authMiddleware
router.put('/icon/:id', auth, updateBoardIcon);

// @desc    Update Board favorite status
// @route   PUT /boards/status/:id
// @access  Private - authMiddleware
router.put('/status/:id', auth, updateBoardStatus);

// @desc    Delete Board
// @route   Delete /boards/:id
// @access  Private - authMiddleware
router.delete('/:id', auth, deleteBoard);

module.exports = router;