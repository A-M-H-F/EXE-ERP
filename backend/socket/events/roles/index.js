const User = require('../../../models/userModel')

const updateRoleEvent = (io, socket) => {
    socket.on('updateRole_to_server', async function ({
        role
    }) {
        const result = await User.find({ role }).lean();

        if (result) {
            result.map(user => {
                io.in(String(user._id)).emit('updateRole_to_client', {});
            })
        }
    });
}

module.exports = {
    updateRoleEvent
}