const sendMessage = (socket, event, reciever, response) => {
    socket.to(reciever).emit(event, response);
}

module.exports = sendMessage