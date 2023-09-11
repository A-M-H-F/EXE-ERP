const router = require('express').Router();
const {
    getAllTasks,
    createTask,
    updateTasksPositionsInsider,
    updateTasksPositions,
    deleteTask,
    updateTaskTitleAndContent
} = require('../../controllers/scrumBoardSectionTask');
const auth = require('../../middleware/auth');

// @desc    Get All Tasks
// @route   GET /boards/sections/tasks/:id
// @access  Private - authMiddleware
router.get('/:id', auth, getAllTasks);

// @desc    Create Task
// @route   POST /boards/sections/tasks/:id
// @access  Private - authMiddleware
router.post('/:id', auth, createTask);

// @desc    Update tasks position
// @route   PUT /boards/sections/tasks/insider
// @access  Private - authMiddleware
router.put('/insider', auth, updateTasksPositionsInsider);

// @desc    Update tasks position
// @route   PUT /boards/sections/tasks/positions
// @access  Private - authMiddleware
router.put('/positions', auth, updateTasksPositions);

// @desc    Update task title and content
// @route   PUT /boards/sections/tasks/info/:id
// @access  Private - authMiddleware
router.put('/info/:id', auth, updateTaskTitleAndContent);

// @desc    Delete Task
// @route   DELETE /boards/sections/tasks/:id
// @access  Private - authMiddleware
router.delete('/:id', auth, deleteTask);

module.exports = router;
