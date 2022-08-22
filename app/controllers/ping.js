const log = require('app/helpers/logger');

const getPing = async (_req, res) => {
    try {
        res.send('pong');
    } catch (err) {
        log.error(err, 'ping::getPing');
    }
};

module.exports = {
    getPing
};