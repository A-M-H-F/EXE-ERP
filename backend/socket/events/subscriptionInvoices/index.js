const getSubscriptionInvoicesEvent = (io, socket) => {
    socket.on('getSubscriptionInvoices_to_server', async function ({
        userId
    }) {
        io.in('all').emit('getSubscriptionInvoices_to_client', { userId });
    });
}

module.exports = {
    getSubscriptionInvoicesEvent,
}