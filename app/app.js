const express = require('express');

const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');

const routes = require('./routes');
const settings = require('./settings');
const logger = require('app/helpers/logger');

const loggingStreams = [];
if (settings.env === 'production') {
    loggingStreams.push({
        type: 'rotating-file',
        path: path.resolve(__dirname, '../log', 'production.log')
    });
} else {
    loggingStreams.push(
        { level: 'info', stream: process.stdout },
        { path: path.resolve(__dirname, '../log', 'development.log') }
    );
}

const log = bunyan.createLogger({
    name: 'kerpak-app-server',
    streams: loggingStreams,
    serializers: bunyan.stdSerializers
});

const app = express();
app.disable('x-powered-by');

app.set('logger', log);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());

//init logs
logger.use(log);

log.info('Initializing');

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.use('/api', routes);

// error handler
app.use(function (error, req, res, next) {
    logger.error({ error }, 'Error');
    res.status(error.status || 500).json({ error });
});

module.exports = app;