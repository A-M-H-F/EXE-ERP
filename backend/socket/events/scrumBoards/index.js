const addNewBoardEvent = (io, socket) => {
    socket.on('addNewBoard_to_server', function ({
        users
    }) {
        // we will emit this message to all clients in given room
        if (users.length > 0) {
            users.map(user => {
                io.in(user.user).emit('addNewBoard_to_client', {});
            })
        }
    });
}

const updateBoardEvent = (io, socket) => {
    socket.on('updateBoard_to_server', function ({
        users
    }) {
        // we will emit this message to all clients in given room
        if (users.length > 0) {
            users.map(user => {
                io.in(user.user).emit('updateBoard_to_client', {});
            })
        }
    });
}

const deleteBoardEvent = (io, socket) => {
    socket.on('deleteBoard_to_server', function ({
        users
    }) {
        // we will emit this message to all clients in given room
        if (users.length > 0) {
            users.map(user => {
                io.in(user.user).emit('deleteBoard_to_client', {});
            })
        }
    });
}

const boardSectionsEvent = (io, socket) => {
    socket.on('boardSections_to_server', function ({
        users
    }) {
        // we will emit this message to all clients in given room
        if (users.length > 0) {
            users.map(user => {
                io.in(user.user).emit('boardSections_to_client', {});
            })
        }
    });
}

const updateBoardUsersEvent = (io, socket) => {
    socket.on('updateBoardUsers_to_server', function ({
        user,
        fromBoard
    }) {
        console.log(user)
        console.log(fromBoard)
        // we will emit this message to all clients in given room
        io.in(user).emit('updateBoardUsers_to_client', { fromBoard });
    });
}

module.exports = {
    addNewBoardEvent,
    updateBoardEvent,
    deleteBoardEvent,
    boardSectionsEvent,
    updateBoardUsersEvent
};