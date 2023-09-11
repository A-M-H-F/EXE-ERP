const getAllIspEvent = (io, socket) => {
    socket.on('getAllIsp_to_server', async function ({
        userId
    }) {
        io.in('all').emit('getAllIsp_to_client', { userId });
    });
}

module.exports = {
    getAllIspEvent
}