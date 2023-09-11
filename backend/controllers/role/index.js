const asyncHandler = require('express-async-handler');
const Role = require('../../models/roleModel');
const User = require('../../models/userModel');

// @desc    Add New Role
// @route   POST /role
// @access  Private - authMiddleware
const addNewRole = asyncHandler(async (req, res) => {
    const { name, access } = req.body;

    if (!name || !access) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (!Array.isArray(access) || access.length <= 0) {
        res.status(400);
        throw new Error('Please add at least one access option from the list')
    }

    const checkRoleName = await Role.findOne({ name });

    if (checkRoleName) {
        res.status(400);
        throw new Error('Please choose a unique role name');
    }

    const addRole = await Role.create(
        {
            name,
            access
        }
    );

    if (addRole) {
        res.status(200).json({ message: 'Role added successfully' });
    } else {
        res.status(400);
        throw new Error('Error adding new role');
    }
})

// @desc    Update Role
// @route   PUT /role/:id
// @access  Private - authMiddleware
const updateRole = asyncHandler(async (req, res) => {
    const { name, access } = req.body;

    if (!name || !access) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    if (!Array.isArray(access) || access.length <= 0) {
        res.status(400);
        throw new Error('Please check all fields');
    }

    const checkRole = await Role.findById(req.params.id);

    if (!checkRole) {
        res.status(400);
        throw new Error('Role not found');
    }

    const checkDuplicate = await Role.findOne(
        {
            _id: { $ne: req.params.id },
            name
        }
    );

    if (checkDuplicate) {
        res.status(400);
        throw new Error('Please choose a unique name');
    }

    const updateR = await Role.findByIdAndUpdate(
        checkRole._id,
        {
            $set: {
                name,
                access
            }
        }
    );

    if (updateR) {
        res.status(200).json({ message: 'Role updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating role');
    }
})

// @desc    Get all roles
// @route   GET /role
// @access  Private - authMiddleware
const getAllRoles = asyncHandler(async (req, res) => {
    const roles = await Role.find()
        .select('name createdAt updatedAt')
        .lean();

    if (roles) {
        res.status(200).json(roles);
    } else {
        res.status(400);
        throw new Error('Error getting roles');
    }
})

// @desc    Get specific role
// @route   GET /role/:id
// @access  Private - authMiddleware
const getSpecificRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id)
        .select('-__v')
        .lean();

    if (role) {
        res.status(200).json(role);
    } else {
        res.status(400);
        throw new Error('Error getting role');
    }
})

// @desc    Remove Role
// @route   DELETE /role/:id
// @access  Private - authMiddleware
const removeRole = asyncHandler(async (req, res) => {
    const isExists = await Role.findById(req.params.id);

    if (!isExists) {
        res.status(400);
        throw new Error('Role not found');
    }

    const checkUserRoles = await User.find(
        {
            role: isExists._id
        }
    );

    if (checkUserRoles.length > 0) {
        const total = checkUserRoles.length;
        res.status(400);
        throw new Error(`Please change users roles first, you have ${total} users that have this role assigned to`);
    }

    const remove = await Role.findByIdAndDelete(isExists._id);

    const newRolesList = await Role.find()
        .select('name createdAt updatedAt')
        .lean();

    if (remove && newRolesList) {
        res.status(200).json({ message: 'Role removed successfully', newRolesList });
    } else {
        res.status(400);
        throw new Error('Error removing role');
    }
})

module.exports = {
    getAllRoles,
    getSpecificRole,
    addNewRole,
    updateRole,
    removeRole
}