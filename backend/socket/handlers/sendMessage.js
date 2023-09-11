const sendMessage = (socket, event, receiver, response) => {
    socket.to(receiver).emit(event, response);
}

module.exports = sendMessage