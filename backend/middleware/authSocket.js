const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authSocket = async (socket, next) => {
    let token;

    if (socket.handshake.auth.token) {
        token = socket.handshake.auth.token;
        console.log(token)

        try {
            // Verify the token using jwt.verify
            // const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
            jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);

            // const user = await User.findById(decoded.id).select('-password');

            // socket.user = user;

            // // Add the decoded token to the socket object
            // socket.decoded = decoded;

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

