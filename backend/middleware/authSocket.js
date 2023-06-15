const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authSocket = async (socket, next) => {
    let token;

    if (socket.handshake.headers.authorization) {
        token = socket.handshake.headers.authorization;

        try {
            // Verify the token using jwt.verify
            const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            // check user role
            // if (user.role !== 'Admin')
            //     throw new Error('Admin resources access denied')

            socket.user = user;

            // Add the decoded token to the socket object
            socket.decoded = decoded;

            next();
        } catch (error) {
            next(error);
        }
    }

    if (!token) {
        next(new Error('Authentication error'));
    }
}

module.exports = authSocket

