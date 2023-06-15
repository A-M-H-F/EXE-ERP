const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const { table } = require('table');

const logEvents = async (logItem, logFileName) => {
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        // Create a new table
        let headings
        if (logFileName === 'reqLog.log') {
            headings = ['Date & Time', 'UUID', 'Method', 'URL', 'Origin'];
        } else if (logFileName === 'errLog.log') {
            headings = ['Date & Time', 'UUID', 'Message', 'Method', 'URL', 'Origin'];
        } else if (logFileName === 'mongoErrLog.log') {
            headings = ['Date & Time', 'UUID', 'Error Number', 'Error Code', 'System Call', 'Hostname'];
        } else if (logFileName === 'limiterLog.log') {
            headings = ['Date & Time', 'UUID', 'Message', 'Method', 'URL', 'Origin'];
        } else if (logFileName === 'mongoConnectionErrLog.log') {
            headings = ['Date & Time', 'UUID', 'Type', 'Title', 'Message', 'Retries'];
        } else {
            headings = ['Date & Time', 'UUID', 'Method', 'URL', 'Origin', 'Client IP', 'User-Agent'];
        }

        const logData = [format(new Date(), 'dd/MM/yyyy HH:mm:ss'), uuid()].concat(logItem.split('\t'));
        const tableData = [headings, logData];
        const tableString = table(tableData);

        // Write or append the table to the file
        fs.appendFile(path.join(__dirname, '..', 'logs', logFileName), tableString, 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

const logger = (req, res, next) => {
    // save user logs
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    // save user logs with user-agent and ip address
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}\t${req.ip}\t${req.headers['user-agent']}`, 'reqFullLog.log');
    // console.log(`${req.method} ${req.path}`)
    next();
}

module.exports = { logEvents, logger }