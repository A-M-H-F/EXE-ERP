const asyncHandler = require('express-async-handler');
const Section = require('../../models/scrumBoardSection');
const Task = require('../../models/scrumBoardSectionTask');

// @desc    Get All Tasks
// @route   GET /boards/sections/tasks/:id
// @access  Private - authMiddleware
const getAllTasks = asyncHandler(async (req, res) => {
    const result = await Task.find(
        {
            section: req.params.id
        }
    )
        .sort({ position: 1 })
        .select('-section')
        // .populate({
        //     path: 'creator',
        //     select: 'name -_id'
        // })
        // .populate({
        //     path: 'updatedBy',
        //     select: 'name -_id'
        // })
        // .populate({
        //     path: 'editHistory.editedBy',
        //     select: 'name -_id'
        // })
        // .populate({
        //     path: 'moveHistory.movedBy',
        //     select: 'name -_id'
        // })
        // .populate('moveHistory.movedBy')
        .lean();

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(400);
        throw new Error('Error getting section tasks');
    }

    // result.sort((a, b) => a.position - b.position);

})

// @desc    Create Task
// @route   POST /boards/sections/tasks/:id
// @access  Private - authMiddleware
const createTask = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const isSectionExists = await Section.findById(req.params.id)
    if (!isSectionExists) {
        res.status(400);
        throw new Error('Section does not exists');
    }

    const taskCounter = await Task.find({ section: req.params.id }).countDocuments();

    const result = await Task.create({
        section: req.params.id,
        title,
        content,
        position: taskCounter > 0 ? taskCounter : 0,
        creator: req.user.id
    })

    if (result) {
        const newTask = {
            _id: String(result._id),
            section: String(result.section),
            title: result.title,
            content: result.content,
            position: result.position,
            creator: { name: req.user.name, _id: req.user.id },
            updatedBy: { name: req.user.name, _id: req.user.id },
            editHistory: [],
            moveHistory: []
        }

        res.status(200).json(
            {
                message: 'Task added successfully',
                newTask
            }
        )
    } else {
        res.status(400);
        throw new Error('Error adding task');
    }
})

// @desc    Update tasks position insider
// @route   PUT /boards/sections/tasks/insider
// @access  Private - authMiddleware
const updateTasksPositionsInsider = asyncHandler(async (req, res) => {
    const { newTasksPositions } = req.body;

    const result = await Promise.all(newTasksPositions.map(async (task, index) => {
        const isTask = await Task.findById(task._id);

        if (isTask) {
            await Task.findByIdAndUpdate(
                task._id,
                {
                    $set: {
                        position: index,
                        updatedBy: req.user.id
                    },
                }
            )
        }
    }))

    if (result) {
        res.status(200).json({ message: 'moved' });
    } else {
        res.status(400);
        throw new Error('Error moving, please refresh');
    }
})

// @desc    Update tasks position
// @route   PUT /boards/sections/tasks/positions
// @access  Private - authMiddleware
const updateTasksPositions = asyncHandler(async (req, res) => {
    const {
        sourceTasks,
        destinationTasks,
        sourceSectionId,
        sourceSectionName,
        destinationSectionId,
        destinationSectionName } = req.body;

    const sourceTasksResult = await Promise.all(sourceTasks.map(async (task, index) => {
        const isTask = await Task.findById(task._id);

        if (isTask) {
            await Task.findByIdAndUpdate(
                task._id,
                {
                    $set: {
                        section: sourceSectionId,
                        position: index,
                        updatedBy: req.user.id
                    },
                }
            )
        }
    }))

    const destinationTasksResult = await Promise.all(destinationTasks.map(async (task, index) => {
        const isTask = await Task.findById(task._id);

        if (isTask) {
            const options = {
                $set: {
                    section: destinationSectionId,
                    position: index,
                    updatedBy: req.user.id
                },
            }

            if (String(task.section) !== String(destinationSectionId)) {
                options.$push = {
                    moveHistory: {
                        from: sourceSectionName,
                        to: destinationSectionName,
                        movedBy: req.user.id,
                        date: new Date()
                    }
                }
            }

            await Task.findByIdAndUpdate(
                task._id,
                options
            )
        }
    }))

    if (sourceTasksResult && destinationTasksResult) {
        res.status(200).json({ message: 'moved' });
    } else {
        res.status(400);
        throw new Error('Error moving, please refresh');
    }
})

// @desc    Update task title and content
// @route   PUT /boards/sections/tasks/info/:id
// @access  Private - authMiddleware
const updateTaskTitleAndContent = asyncHandler(async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const taskId = req.params.id;

    const isTaskExists = await Task.findById(taskId).lean();
    if (!isTaskExists) {
        res.status(400);
        throw new Error('Task not found');
    }

    const result = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: {
                title,
                content,
                updatedBy: req.user.id
            },
            $push: {
                editHistory: {
                    title: title === isTaskExists.title ? '' : isTaskExists.title,
                    content: content === isTaskExists.content ? '' : isTaskExists.content,
                    date: new Date(),
                    editedBy: req.user.id
                }
            }
        }
    )

    if (result) {
        res.status(200).json({ message: 'Task updated successfully' });
    }  else {
        res.status(400);
        throw new Error('Error updating task');
    }
})

// @desc    Delete Task
// @route   DELETE /boards/sections/tasks/:id
// @access  Private - authMiddleware
const deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.params.id;

    const isTaskExists = await Task.findById(taskId);
    if (!isTaskExists) {
        res.status(400);
        throw new Error('Task not found');
    }

    const result = await Task.findByIdAndDelete(taskId);

    const newTasks = await Task.find({ section: isTaskExists.section })
        .sort({ position: 1 });

    const reArrange = await Promise.all(newTasks.map(async (task, index) => {
        await Task.findByIdAndUpdate(
            task._id,
            {
                $set: {
                    position: index
                }
            }
        )
    }));

    if (result && reArrange) {
        res.status(200).json({ message: 'Task deleted successfully' });
    } else {
        res.status(400);
        throw new Error('Error deleting task');
    }
})

module.exports = {
    getAllTasks,
    createTask,
    updateTaskTitleAndContent,
    deleteTask,
    updateTasksPositionsInsider,
    updateTasksPositions
}