const getAllInternetServicesEvent = (io, socket) => {
    socket.on('getAllInternetServices_to_server', async function ({
        userId
    }) {
        io.in('all').emit('getAllInternetServices_to_client', { userId });
    });
}

module.exports = {
    getAllInternetServicesEvent,
}