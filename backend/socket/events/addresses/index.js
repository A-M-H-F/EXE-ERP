const getAllLocationsEvent = (io, socket) => {
    socket.on('getLocations_to_server', async function ({
        userId
    }) {
        io.in('all').emit('getLocations_to_client', { userId });
    });
}

const getWhoUpdatingLocationEvent = (io, socket) => {
    socket.on('getWhoUpdatingLocation_to_server', async function ({
        userId,
        userName,
        id
    }) {
        io.in('all').emit('getWhoUpdatingLocation_to_client', { userId, userName, id });
    });
}

module.exports = {
    getAllLocationsEvent,
    getWhoUpdatingLocationEvent
}