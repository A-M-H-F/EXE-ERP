const allowedOriginsWeb = require('../allowedOrigins/allowedOriginsWeb');

const corsOptionsWeb = {
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
        if (isAllowed || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptionsWeb