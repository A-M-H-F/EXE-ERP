const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../../models/userModel');

// @desc    Web 2.0 Login
// @route   POST /auth/login
// @access  Public
const authLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // check if all the fields are available
    if (!username || !password) {
        res.status(401)
        throw new Error('Please add all fields');
    }

    // Check for user username
    const user = await User.findOne({ username: username }).lean();

    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (user.status === 'inactive') {
        res.status(401);
        throw new Error('Your account is inactive, please contact the support')
    }

    // check the password
    const checkPassword = await bcrypt.compare(password, user.password);

    // createAdminRefreshToken({ id: user._id });
    if (user && checkPassword) {
        const extreme_refresh = createAdminRefreshToken({ id: user._id });
        if (process.env.NODE_ENV === 'production') {
            // production
            res.cookie('extreme_refresh', extreme_refresh, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: 'None',
                // domain: 'extremeengineering.com'
            });
        } else {
            // development
            res.cookie('extreme_refresh', extreme_refresh, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                path: '/',
                httpOnly: true,
                domain: '127.0.0.1'
            });
        }
        res.json({ message: "Login Success!" });
    } else {
        res.status(401);
        throw new Error('Invalid Credentials');
    }
})

// @desc    Get Access Token
// @route   POST /auth/extreme-ref
// @access  Private - authMiddleware
const getAccessToken = asyncHandler(async (req, res) => {
    // Done
    try {
        const rf_token = req.cookies.extreme_refresh;
        if (!rf_token) {
            res.status(401);
            throw new Error('Please login now')
        }

        jwt.verify(rf_token, process.env.ADMIN_REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(401);
                throw new Error('Please login now');
            } 

            const access_token = createAccessToken({ id: user.id.id });

            res.json({ access_token });
        })
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// @desc    Logout
// @route   POST /auth/logout
// @access  Private - authMiddleware
const authLogout = asyncHandler(async (req, res) => {
    // Done
    try {
        if (process.env.NODE_ENV === 'production') {
            // production
            res.clearCookie('extreme_refresh', {
                httpOnly: true,
                secure: true,
                httpOnly: true,
                sameSite: 'none',
                // domain: 'exe.com'
            });
        } else {
            //development
            res.clearCookie('extreme_refresh', {
                path: '/',
                httpOnly: true,
            });
        }

        return res.status(200).json({ message: "Logged out Successfully." });
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Create Access Token
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: '200m' });
}

// Create Admin Refresh Token
const createAdminRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.ADMIN_REFRESH_TOKEN_SECRET, {
        expiresIn: '60d',
    });
}

module.exports = {
    authLogin,
    getAccessToken,
    authLogout,
}
