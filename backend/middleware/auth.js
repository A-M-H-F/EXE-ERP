const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const auth = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (
                !req.path.startsWith('/logout') &&
                req.user.status === 'inactive'
            ) throw new Error('Your account is inactive');;

            next();
        } catch (error) {
            // console.log(error)
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
})

module.exports = auth

