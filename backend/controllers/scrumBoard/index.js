const asyncHandler = require('express-async-handler');
const Board = require('../../models/scrumBoard');
const Section = require('../../models/scrumBoardSection');
const Task = require('../../models/scrumBoardSectionTask');

// @desc    Get All Boards
// @route   GET /boards
// @access  Private - authMiddleware
const getAllBoards = asyncHandler(async (req, res) => {
    const result = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: false } }
    })
        .select('title icon users.position')
        .lean();

    result.sort((a, b) => a.users[0].position - b.users[0].position);

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting boards');
    }
})

// @desc    Get Favorite boards
// @route   GET /boards/status/favorite
// @access  Private - authMiddleware
const getFavoriteBoards = asyncHandler(async (req, res) => {
    const result = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: true } }
    })
        // .sort({ 'users.favoritePosition': 1 })
        .select('title icon users.favoritePosition')
        .lean();

    result.sort((a, b) => a.users[0].favoritePosition - b.users[0].favoritePosition);

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting favorite boards');
    }
})

// @desc    Get specific board
// @route   GET /boards/:id
// @access  Private - authMiddleware
const getSpecificBoard = asyncHandler(async (req, res) => {
    const result = await Board.findById(req.params.id)
        .select('-__v -createdAt -updatedAt -users.position -users.favorite -users.favoritePosition -users._id')
        .populate({
            path: 'users.user',
            select: 'name picture'
        })
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting board');
    }
})

// @desc    Create Board
// @route   POST /boards
// @access  Private - authMiddleware
const createBoard = asyncHandler(async (req, res) => {
    const {
        users,
        title,
        description,
        icon
    } = req.body

    if (!users || users.length <= 0 || !title) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const boardPromises = users.map(async (userObj) => {
        const userId = userObj.user;
        const boardsCount = await Board.find({ 'users.user': userId }).countDocuments();
        const position = boardsCount > 0 ? boardsCount : 0;

        return {
            user: userId,
            position: position
        };
    });

    const boardPositions = await Promise.all(boardPromises);

    const result = await Board.create(
        {
            creator: req.user.id,
            users: boardPositions,
            title: title,
            description: description,
            icon: icon
        }
    );

    const boards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: false } }
    })
        .select('title icon users.position')
        .lean();

    boards.sort((a, b) => a.users[0].position - b.users[0].position);

    if (result) {
        res.status(200).json({
            message: "Board created successfully",
            boardId: result._id,
            boards
        });
    } else {
        res.status(400);
        throw new Error('Error creating new board');
    }
})


// @desc    Update Boards position
// @route   PUT /boards/position
// @access  Private - authMiddleware
const updateBoardsPosition = asyncHandler(async (req, res) => {
    const { boards } = req.body;

    if (!boards || boards.length <= 0) {
        res.status(400);
        throw new Error('Error, no boards selected');
    }

    const result = await Promise.all(boards.map(async (boardData) => {
        const board = await Board.findById(boardData.board);

        if (board) {
            await Board.findOneAndUpdate(
                { _id: boardData.board, 'users.user': req.user.id },
                {
                    $set: {
                        'users.$.position': boardData.position
                    }
                }
            );
        }
    }));

    if (result) {
        res.status(200).json({ message: 'Board positions updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating boards positions');
    }
})

// @desc    Update board users
// @route   PUT /boards/user/update/:id
// @access  Private - authMiddleware
const updateBoardUsers = asyncHandler(async (req, res) => {
    const { users } = req.body;
    const userId = req.user.id;

    if (!users) {
        res.status(400);
        throw new Error('Please check the user');
    }

    const isExists = await Board.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('Board not found');
    }

    if (String(isExists.creator) !== String(userId)) {
        res.status(400);
        throw new Error('Error, not the creator');
    }

    const result = await Board.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                users: users
            }
        },
        {
            new: true
        }
    ).select('-__v -createdAt -updatedAt -users.position -users.favorite -users.favoritePosition -users._id')
        .populate({
            path: 'users.user',
            select: 'name picture'
        })
        .lean();

    if (result) {
        res.status(200).json({
            message: "Board users updated successfully",
            newBoardInfo: result
        });
    } else {
        res.status(400);
        throw new Error('Error board users');
    }
})

// @desc    Update Board title
// @route   PUT /boards/title/:id
// @access  Private - authMiddleware
const updateBoardTitle = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;

    if (!title) {
        res.status(400);
        throw new Error('Please add a title');
    }

    const isExists = await Board.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('Board not found.');
    }

    if (String(isExists.creator) !== String(userId)) {
        res.status(400);
        throw new Error('Error, not the creator');
    }

    const result = await Board.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title
            }
        },
        {
            new: true
        }
    ).select('-__v -createdAt -updatedAt -users.position -users.favorite -users.favoritePosition -users._id')
        .populate({
            path: 'users.user',
            select: 'name picture'
        })
        .lean();

    const standardBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: false } }
    })
        .select('title icon users.position')
        .lean();

    standardBoards.sort((a, b) => a.users[0].position - b.users[0].position);

    const favoriteBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: true } }
    })
        .select('title icon users.favoritePosition')
        .lean();

    favoriteBoards.sort((a, b) => a.users[0].favoritePosition - b.users[0].favoritePosition);

    if (result) {
        res.status(200).json({
            message: "Board title updated successfully",
            newBoardInfo: result,
            standardBoards,
            favoriteBoards
        });
    } else {
        res.status(400);
        throw new Error('Error updating board title');
    }
})

// @desc    Update Board description
// @route   PUT /boards/description/:id
// @access  Private - authMiddleware
const updateBoardDescription = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const userId = req.user.id;

    if (!description) {
        res.status(400);
        throw new Error('Please add a description');
    }

    const isExists = await Board.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('Board not found.');
    }

    if (String(isExists.creator) !== String(userId)) {
        res.status(400);
        throw new Error('Error, not the creator');
    }

    const result = await Board.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                description
            }
        },
        {
            new: true
        }
    ).select('-__v -createdAt -updatedAt -users.position -users.favorite -users.favoritePosition -users._id')
        .populate({
            path: 'users.user',
            select: 'name picture'
        })
        .lean();

    const standardBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: false } }
    })
        .select('title icon users.position')
        .lean();

    standardBoards.sort((a, b) => a.users[0].position - b.users[0].position);

    const favoriteBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: true } }
    })
        .select('title icon users.favoritePosition')
        .lean();

    favoriteBoards.sort((a, b) => a.users[0].favoritePosition - b.users[0].favoritePosition);

    if (result) {
        res.status(200).json({
            message: "Board description updated successfully",
            newBoardInfo: result,
            standardBoards,
            favoriteBoards
        });
    } else {
        res.status(400);
        throw new Error('Error updating board description');
    }
})

// @desc    Update Board icon
// @route   PUT /boards/icon/:id
// @access  Private - authMiddleware
const updateBoardIcon = asyncHandler(async (req, res) => {
    const { icon } = req.body;
    const userId = req.user.id;

    if (!icon) {
        res.status(400);
        throw new Error('Please add icon');
    }

    const isExists = await Board.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('Board not found.');
    }

    if (String(isExists.creator) !== String(userId)) {
        res.status(400);
        throw new Error('Error, not the creator');
    }

    const result = await Board.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                icon
            }
        },
        {
            new: true
        }
    ).select('-__v -createdAt -updatedAt -users.position -users.favorite -users.favoritePosition -users._id')
        .populate({
            path: 'users.user',
            select: 'name picture'
        })
        .lean();

    const standardBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: false } }
    })
        .select('title icon users.position')
        .lean();

    standardBoards.sort((a, b) => a.users[0].position - b.users[0].position);

    const favoriteBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: true } }
    })
        .select('title icon users.favoritePosition')
        .lean();

    favoriteBoards.sort((a, b) => a.users[0].favoritePosition - b.users[0].favoritePosition);

    if (result) {
        res.status(200).json({
            message: "Board icon updated successfully",
            newBoardInfo: result,
            standardBoards,
            favoriteBoards
        });
    } else {
        res.status(400);
        throw new Error('Error updating board icon');
    }
})

// @desc    Update Board favorite status
// @route   PUT /boards/status/:id
// @access  Private - authMiddleware
const updateBoardStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const userId = req.user.id;

    if (typeof status !== 'boolean') {
        res.status(400);
        throw new Error('Please choose a status');
    }

    const isExists = await Board.findById(req.params.id);
    if (!isExists) {
        res.status(400);
        throw new Error('Board not found.');
    }

    const favoriteCounter = await Board.find({
        users: { $elemMatch: { user: userId, favorite: true } }
    }).countDocuments()

    const counter = await Board.find({
        users: { $elemMatch: { user: userId, favorite: false } }
    }).countDocuments()

    const result = await Board.findOneAndUpdate(
        { _id: req.params.id, 'users.user': userId },
        {
            $set: {
                'users.$.favorite': status,
                'users.$.favoritePosition': status && favoriteCounter > 0 ? favoriteCounter : 0,
                'users.$.position': !status && counter > 0 ? counter : 0,
            }
        }
    );

    const boards = await Board.find({
        users: { $elemMatch: { user: userId, favorite: false } }
    })
        .select('users.position')
        .lean();

    boards.sort((a, b) => a.users[0].position - b.users[0].position);

    const updatePositions = await Promise.all(boards.map(async (boardData, index) => {
        const board = await Board.findById(boardData._id);

        if (board) {
            await Board.findOneAndUpdate(
                { _id: boardData._id, 'users.user': userId },
                {
                    $set: {
                        'users.$.position': index
                    }
                }
            );
        }
    }));

    const standardBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: false } }
    })
        .select('title icon users.position')
        .lean();

    standardBoards.sort((a, b) => a.users[0].position - b.users[0].position);

    const favoriteBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: true } }
    })
        .select('title icon users.favoritePosition')
        .lean();

    favoriteBoards.sort((a, b) => a.users[0].favoritePosition - b.users[0].favoritePosition);

    const statusCondition = status ? 'added to' : 'removed from';

    if (result && updatePositions) {
        res.status(200).json(
            {
                message: `Board ${statusCondition} favorites`,
                standardBoards,
                favoriteBoards
            }
        );
    } else {
        res.status(400);
        throw new Error('Error updating board status');
    }
})

// @desc    Update Boards favorite position
// @route   PUT /boards/favoritePosition
// @access  Private - authMiddleware
const updateBoardFavoritePosition = asyncHandler(async (req, res) => {
    const { boards } = req.body;

    if (!boards || boards.length <= 0) {
        res.status(400);
        throw new Error('Error, no boards selected');
    }

    const result = await Promise.all(boards.map(async (boardData) => {
        const board = await Board.findById(boardData.board);

        if (board) {
            await Board.findOneAndUpdate(
                { _id: boardData.board, 'users.user': req.user.id },
                {
                    $set: {
                        'users.$.favoritePosition': boardData.favoritePosition
                    }
                }
            );
        }
    }));

    if (result) {
        res.status(200).json({ message: 'Board favorite position updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating boards favorite positions');
    }
})

// @desc    Delete Board
// @route   Delete /boards/:id
// @access  Private - authMiddleware
const deleteBoard = asyncHandler(async (req, res) => {
    const boardId = req.params.id;
    const userId = req.user.id;

    const isExists = await Board.findById(boardId);
    if (!isExists) {
        res.status(400);
        throw new Error('Board not found');
    }

    if (String(isExists.creator) !== String(userId)) {
        res.status(400);
        throw new Error('Error, not the creator');
    }

    const deleteBoard = await Board.findByIdAndDelete(boardId);

    const sectionsToDelete = await Section.find({ board: boardId });
    const sectionIdsToDelete = sectionsToDelete.map(section => section._id);

    const deleteSections = await Section.deleteMany({ board: boardId });
    const deleteTasks = await Task.deleteMany({ section: { $in: sectionIdsToDelete } });

    const standardBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: false } }
    })
        .select('title icon users.position')
        .lean();

    standardBoards.sort((a, b) => a.users[0].position - b.users[0].position);

    const favoriteBoards = await Board.find({
        users: { $elemMatch: { user: req.user.id, favorite: true } }
    })
        .select('title icon users.favoritePosition')
        .lean();

    favoriteBoards.sort((a, b) => a.users[0].favoritePosition - b.users[0].favoritePosition);

    if (deleteBoard && deleteSections && deleteTasks) {
        res.status(200).json({
            message: 'Board deleted successfully',
            standardBoards,
            favoriteBoards
        });
    } else {
        res.status(400);
        throw new Error('Error deleting board');
    }
})

module.exports = {
    getAllBoards,
    getSpecificBoard,
    createBoard,
    updateBoardsPosition,
    updateBoardTitle,
    getFavoriteBoards,
    updateBoardFavoritePosition,
    updateBoardStatus,
    updateBoardDescription,
    updateBoardIcon,
    deleteBoard,
    updateBoardUsers
}