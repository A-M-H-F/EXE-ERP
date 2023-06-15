const adminNotifications = (socket) => {
    socket.on('adminNotifications', (message) => {
        socket.to('admin').emit('adminNotifications', message)
    })
}

module.exports = adminNotifications;