// socket/index.js
const authSocket = require('../middleware/authSocket');
const admin = require('./admin');
const adminNotifications = require('./adminNotifications');

const socketListeners = (io) => {
    // JWT middleware
    // io.use((socket, next) => {
    //     authSocket(socket, next);
    // })

    io.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room ${room}`);
        });

        // Set up listeners and emitters
        admin(socket);
        adminNotifications(socket);
    });
};

module.exports = socketListeners;