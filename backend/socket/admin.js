const emit = (socket, event, response) => {
    socket.emit(event, response);
}

const admin = (socket) => {
    socket.on('test', async (data) => {
        // const response = await testUpdate(data);
        // const response = await updatePassword(socket, data);

        // if (response.error) {
        //     errorHandler(socket, response);
        // } else {
        //     emit(socket, 'updateUser', response);
        // }


        
    })
};

module.exports = admin;