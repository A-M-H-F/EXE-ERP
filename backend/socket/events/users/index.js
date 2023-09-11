const updateUserStatusEvent = (io, socket) => {
    socket.on('updateUserStatus_to_server', async function ({
        userId
    }) {
        io.in(String(userId)).emit('updateUserStatus_to_client', {});
    });
}

const updateUserRoleEvent = (io, socket) => {
    socket.on('updateUserRole_to_server', async function ({
        userId
    }) {
        io.in(String(userId)).emit('updateUserRole_to_client', {});
    });
}

const updateUserPasswordEvent = (io, socket) => {
    socket.on('updateUserPass_to_server', async function ({
        userId
    }) {
        io.in(String(userId)).emit('updateUserPass_to_client', {})
    });
}

const updateUserInfoEvent = (io, socket) => {
    socket.on('updateUserInfo_to_server', async function ({
        userId
    }) {
        io.in(String(userId)).emit('updateUserInfo_to_client', {})
    });
}

const getUsersListEvent = (io, socket) => {
    socket.on('getUsersList_to_server', async function ({ userId }) {
        io.in('all').emit('getUsersList_to_client', { userId })
    });
}

module.exports = {
    updateUserStatusEvent,
    updateUserRoleEvent,
    updateUserPasswordEvent,
    updateUserInfoEvent,
    getUsersListEvent
}