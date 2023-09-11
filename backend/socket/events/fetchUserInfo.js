const fetchUserInfo = (io, socket) => {
    socket.on('fetchUserInfo_to_server', function ({
        roomName,
    }) {
        //we will emit this message to all clients in given room
        io.in(roomName).emit('fetchUserInfo_to_client', {});
    });
}

module.exports = fetchUserInfo;