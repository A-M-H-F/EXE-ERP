require('dotenv').config();
require('express-async-errors');
const express = require('express');
const http = require('http'); // for socket
const path = require('path');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/database/mongoConnection');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
// socket.Io
const socketIo = require('socket.io');
const socketListeners = require('./socket');
// opt
// const cluster = require('node:cluster');
// const totalCPUs = require('node:os').cpus().length;
const corsOptionsWeb = require('./config/corsOptions/corsOptionsWeb');
// const webRequestLimiter = require('./requestLimiters/webRequestLimiter');
const corsOptionsSocket = require('./config/corsOptions/corsOptionSocket');

const server = http.createServer(app);
// socket.io
const io = socketIo(server, corsOptionsSocket); // socketIo(server, corsOptionsSocket); // with cors
socketListeners(io);

app.use(logger);
app.use(helmet());
// app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/main'));

const webRoutes = express.Router();
webRoutes.use(cors(corsOptionsWeb));
// Auth routes...@ // auth request limiters
webRoutes.use('/auth', require('./routes/auth'));
webRoutes.use('/images', require('./routes/image')); // notification routes

// Routes...@
// webRoutes.use(webRequestLimiter); // request limiter
webRoutes.use('/user', require('./routes/user')); // user routes
webRoutes.use('/role', require('./routes/role')); // roles routes
webRoutes.use('/isp', require('./routes/isp')); // isp routes
webRoutes.use('/internet-service', require('./routes/internetService')); // internet services routes
webRoutes.use('/address', require('./routes/address')); // address routes
webRoutes.use('/customer', require('./routes/customer')); // customer routes
webRoutes.use('/asset', require('./routes/asset')); // assets routes
webRoutes.use('/asset-inventory', require('./routes/assetInventory')); // assets inventory routes
webRoutes.use('/service', require('./routes/service')); // service routes
webRoutes.use('/subscription', require('./routes/subscription')); // subscriptions routes
webRoutes.use('/subscription-invoice', require('./routes/subscriptionInvoice')); // subscription invoice
webRoutes.use('/product', require('./routes/product')); // products routes
webRoutes.use('/product-inventory', require('./routes/productInventory')); // products inventory routes
webRoutes.use('/invoice', require('./routes/invoice')); // invoice routes
webRoutes.use('/maintenance-invoice', require('./routes/maintenanceInvoice')); // maintenance invoice routes
webRoutes.use('/notification', require('./routes/notification')); // notification routes
webRoutes.use('/boards', require('./routes/scrumBoard')); // scrum boards routes
webRoutes.use('/boards/sections', require('./routes/scrumBoardSection')); // scrum boards sections routes
webRoutes.use('/boards/sections/tasks', require('./routes/scrumBoardTask')); // scrum boards tasks routes

app.use('/', webRoutes);

// handling empty - txt/html requests
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
})

app.use(errorHandler);

// Start the server and listen for incoming requests on the specified port
const startServer = async () => {
    server.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });

    // Connect to MongoDB
    connectDB();
};

startServer();

// cluster.Primary
// if (cluster.isMaster) {
//     // console.log(`Number of CPUs is ${totalCPUs}`);

//     // Fork worker processes and pass the connections to them
//     for (let i = 0; i < totalCPUs - 6; i++) {
//         cluster.fork();
//     }

//     // Respawn worker process if it crashes
//     cluster.on('exit', (worker, code, signal) => {
//         // console.log(`worker ${worker.process.pid} died`);
//         cluster.fork();
//     });

//     startServer();

//     // console.log(`Master ${process.pid} is running`);
// } else {
//     // run it for each worker
//     // Connect to MongoDB
//     connectDB();

//     // console.log(`Worker ${process.pid} started`);
// }

mongoose.connection.on('error', (err) => {
    // console.log(err);
    logEvents(
        `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
        'mongoErrLog.log'
    );
});