const adminNotifications = (io, socket) => {
    socket.on('adminNotifications', (message) => {
        io.in('all').emit('adminNotifications',  { message });
    })
}

module.exports = adminNotifications;