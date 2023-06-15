const rateLimit = require('express-rate-limit');
const { logEvents } = require('../middleware/logger');

const authRequestLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // Limit each IP to 5 requests per `window` per minute
    message:
        { message: 'Too many requests attempts, please try again after a 60 second pause.' },
    handler: (req, res, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'limiterLog.log')
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = authRequestLimiter
