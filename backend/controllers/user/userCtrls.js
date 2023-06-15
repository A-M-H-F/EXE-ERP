const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../../models/userModel');
const Role = require('../../models/roleModel');

// @desc    Get user info
// @route   GET /user/info
// @access  Private - authMiddleware
const getUserInfo = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .select('-_id -password')
        .lean();

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400);
        throw new Error('Error getting user info');
    }
})

// @desc    Update User Password
// @route   PUT /user/pass
// @access  Private - authMiddleware
const updateUserPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;

    if (!password) {
        res.status(401);
        throw new Error('Please check all fields');
    }

    const checkUser = await User.findById(req.user.id).lean();

    const checkPassword = await bcrypt.compare(password, checkUser.password);

    if (checkPassword) {
        res.status(400);
        throw new Error('Please choose a new password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updateUserPassword = await User.findByIdAndUpdate(
        req.user.id,
        {
            $set: {
                password: hashedPassword
            }
        }
    );

    if (updateUserPassword) {
        res.status(200).json({ message: 'Password updated successfully' })
    } else {
        res.status(400);
        throw new Error('Error updating password');
    }
})

// @desc    Update User Name
// @route   PUT /user/name
// @access  Private - authMiddleware
const updateUserName = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const findName = await User.findeOne(
        {
            _id: { $ne: req.user.id },
            name
        }
    );

    if (findName) {
        res.status(400);
        throw new Error('Please choose different name');
    }

    if (req.user.name === name) {
        res.status(400);
        throw new Error('Already you have the same name');
    }

    const updateName = await User.findByIdAndUpdate(
        req.user.id,
        {
            $set: {
                name
            }
        }
    );

    if (updateName) {
        res.status(200).json({ message: 'Name updated successfully' })
    } else {
        res.status(400);
        throw new Error('Error updating name');
    }
})

// @desc    Add New User
// @route   POST /user
// @access  Private - authMiddleware
const addNewUser = asyncHandler(async (req, res) => {
    const { name, username, password } = req.body

    // check if all the fields are available 
    if (!username || !password || !name) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    // check username length
    if (username.length <= 3) {
        res.status(400);
        throw new Error('The username must be at least 4 characters long.');
    }

    // check password length >= 6
    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long.');
    }

    // Check if user exists
    const userExists = await User.findOne(
        {
            $or: [
                { username },
                { name }
            ]
        }
    );

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await new User({
        name,
        username,
        password: hashedPassword,
    });

    // save user
    const saveUser = user.save();

    if (saveUser) {
        res.status(200).json({ message: "User added successfully" });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})

// @desc    Update User (Admin)
// @route   PUT /user/:id
// @access  Private - authMiddleware
const updateUserAdmin = asyncHandler(async (req, res) => {
    const { name, username } = req.body;

    const checkUser = await User.findById(req.params.id).lean();

    if (!checkUser) {
        res.status(400);
        throw new Error('User not found');
    }

    const findExists = await User.findOne(
        {
            _id: { $ne: req.params.id },
            $or: [
                { username },
                { name }
            ]
        }
    );

    if (findExists) {
        res.status(400);
        throw new Error('Please choose different name or username');
    }

    const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name,
                username
            }
        }
    )

    if (updateUser) {
        res.status(200).json({ message: 'User data updated successfully' })
    } else {
        res.status(400);
        throw new Error('Error updating user');
    }
})

// @desc    Update User pass (Admin)
// @route   PUT /user/pass/:id
// @access  Private - authMiddleware
const updateUserPasswordAdmin = asyncHandler(async (req, res) => {
    const { password } = req.body;

    const checkUser = await User.findById(req.params.id).lean();

    if (!checkUser) {
        res.status(400);
        throw new Error('User not found');
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password);

    if (checkPassword) {
        res.status(400);
        throw new Error('Please choose a new password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatePass = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                password: hashedPassword
            }
        }
    );

    if (updatePass) {
        res.status(200).json({ message: 'User password updated successfully' });
    } else {
        res.status(400);
        throw new Error('Error updating user password');
    }
})

// @desc    Update User role (Admin)
// @route   PUT /user/role/:id
// @access  Private - authMiddleware
const updateUserRoleAdmin = asyncHandler(async (req, res) => {
    const { role } = req.body;

    const checkRole = await Role.findById(role).lean();

    if (!checkRole) {
        res.status(400);
        throw new Error('Role not found');
    }

    const updateRole = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                role
            }
        }
    )

    if (updateRole) {
        res.status(200).json({ message: 'User role updated successfully' })
    } else {
        res.status(400);
        throw new Error('Error updating user role');
    }
})

// @desc    Update user status
// @route   PUT /user/status/:id
// @access  Private - authMiddleware
const updateUserStatus = asyncHandler(async (req, res) => {
    const isExists = await User.findById(req.params.id);

    if(!isExists) {
        res.status(400);
        throw new Error('User not found');
    }

    const statusCondition = isExists.status === 'active' ? 'inactive' : 'active';

    const updatedUserStatus = await User.findByIdAndUpdate(
        isExists._id,
        {
            $set: {
                status: statusCondition
            }
        }
    );

    if (updatedUserStatus) {
        res.status(200).json({ message: `User status updated to ${statusCondition}` });
    } else {
        res.status(400);
        throw new Error('Error updating user status');
    }
})

// @desc    Get All Users
// @route   GET /user
// @access  Private - authMiddleware
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .populate('role')
        .select('-password')
        .lean();

    if (users) {
        res.status(200).json(users);
    } else {
        res.status(400);
        throw new Error('Error getting users');
    }
})

// @desc    Get Specific user
// @route   GET /user/:id
// @access  Private - authMiddleware
const getSpecificUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .populate('role')
        .select('-password')
        .lean();

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400);
        throw new Error('Error getting user');
    }
})

module.exports = {
    getUserInfo,
    updateUserPassword,
    updateUserName,
    addNewUser,
    updateUserAdmin,
    updateUserPasswordAdmin,
    updateUserRoleAdmin,
    getAllUsers,
    getSpecificUser,
    updateUserStatus
}