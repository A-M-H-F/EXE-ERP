const authSocket = require('../middleware/authSocket');
const adminNotifications = require('./adminNotifications');
const { getAllLocationsEvent, getWhoUpdatingLocationEvent } = require('./events/addresses');
const { getCustomersEvent, updateCustomerInfoEvent, getCustomerEvent } = require('./events/customers');
const fetchUserInfo = require('./events/fetchUserInfo');
const { getAllInternetServicesEvent } = require('./events/internetServices');
const { getAllIspEvent } = require('./events/isp');
const { updateRoleEvent } = require('./events/roles');
const {
    addNewBoardEvent,
    deleteBoardEvent,
    boardSectionsEvent,
    updateBoardEvent,
    updateBoardUsersEvent
} = require('./events/scrumBoards');
const { getSubscriptionInvoicesEvent } = require('./events/subscriptionInvoices');
const { getCustomersSubscriptionsEvent, getCustomerSubscriptionEvent } = require('./events/subscriptions');
const {
    updateUserStatusEvent,
    updateUserRoleEvent,
    updateUserPasswordEvent,
    updateUserInfoEvent,
    getUsersListEvent
} = require('./events/users');

const socketListeners = (io) => {
    // JWT middleware
    // io.use((socket, next) => {
    //     authSocket(socket, next);
    // })

    io.on('connection', (socket) => {
        // console.log('Client connected');
        socket.on('disconnect', () => {
            // console.log('Client disconnected');
        });

        socket.on('joinRoom', (room) => {
            socket.join(room);
            // console.log('User', socket.id, 'joined room', room);
            io.in(room).emit('roomJoined');
        });

        // Set up listeners and emitters
        fetchUserInfo(io, socket);
        adminNotifications(io, socket);

        // roles
        updateRoleEvent(io, socket);

        // Scrum Boards
        addNewBoardEvent(io, socket);
        updateBoardEvent(io, socket);
        deleteBoardEvent(io, socket);
        boardSectionsEvent(io, socket);
        updateBoardUsersEvent(io, socket);

        // users
        updateUserStatusEvent(io, socket);
        updateUserRoleEvent(io, socket);
        updateUserPasswordEvent(io, socket);
        updateUserInfoEvent(io, socket);
        getUsersListEvent(io, socket);

        // isp
        getAllIspEvent(io, socket);

        // internet services
        getAllInternetServicesEvent(io, socket);

        // addresses (locations)
        getAllLocationsEvent(io, socket);
        getWhoUpdatingLocationEvent(io, socket);

        // customers
        getCustomersEvent(io, socket);
        updateCustomerInfoEvent(io, socket);
        getCustomerEvent(io, socket);

        // customers subscriptions
        getCustomersSubscriptionsEvent(io, socket);
        getCustomerSubscriptionEvent(io, socket);

        // subscription Invoices
        getSubscriptionInvoicesEvent(io, socket);
    });
};

module.exports = socketListeners;