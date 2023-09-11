const getCustomersSubscriptionsEvent = (io, socket) => {
    socket.on('getCustomersSubscriptions_to_server', async function ({
        userId
    }) {
        io.in('all').emit('getCustomersSubscriptions_to_client', { userId });
    });
}

const getCustomerSubscriptionEvent = (io, socket) => {
    socket.on('getCustomerSubscription_to_server', async function ({
        customer
    }) {
        io.in('all').emit('getCustomerSubscription_to_client', { customer });
    });
}

module.exports = {
    getCustomersSubscriptionsEvent,
    getCustomerSubscriptionEvent,
}