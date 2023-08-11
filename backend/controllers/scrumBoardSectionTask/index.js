const asyncHandler = require('express-async-handler');
const Section = require('../../models/scrumBoardSection');
const Task = require('../../models/scrumBoardSectionTask');

// @desc    Get All Tasks
// @route   GET /boards/sections/tasks/:id
// @access  Private - authMiddleware
const getAllTasks = asyncHandler(async (req, res) => {

})

const createTask = asyncHandler(async (req, res) => {

})

const updateTask = asyncHandler(async (req, res) => {

})

const deleteTask = asyncHandler(async (req, res) => {

})

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
}