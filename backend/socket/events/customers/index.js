const getCustomersEvent = (io, socket) => {
    socket.on('getCustomers_to_server', async function ({
        userId
    }) {
        io.in('all').emit('getCustomers_to_client', { userId });
    });
}

const updateCustomerInfoEvent = (io, socket) => {
    socket.on('updateCustomer_to_server', async function ({
        userId
    }) {
        io.in('all').emit('updateCustomer_to_client', { userId });
    });
}

const getCustomerEvent = (io, socket) => {
    socket.on('getCustomer_to_server', async function ({
        customer
    }) {
        io.in('all').emit('getCustomer_to_client', { customer });
    });
}

module.exports = {
    getCustomersEvent,
    updateCustomerInfoEvent,
    getCustomerEvent
}