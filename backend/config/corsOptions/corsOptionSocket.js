const allowedOriginsWeb = require('../allowedOrigins/allowedOriginsWeb');

const corsOptionsSocket = {
    cors: {
        origin: (origin, callback) => {
            let isAllowed = false;
            allowedOriginsWeb.forEach((allowedOrigin) => {
                if (allowedOrigin instanceof RegExp) {
                    if (allowedOrigin.test(origin)) {
                        isAllowed = true;
                    }
                } else if (allowedOrigin === origin) {
                    isAllowed = true;
                }
            });
            if (isAllowed) { // (isAllowed || !origin)
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
        allowedHeaders: ['Authorization'],
    },
    // allowRequest: (req, callback) => {
    //     const noOriginHeader = req.headers.origin === undefined;
    //     if (noOriginHeader) {
    //         callback(null, false);
    //     } else {
    //         callback('sad', noOriginHeader);
    //     }
    // },
}

module.exports = corsOptionsSocket