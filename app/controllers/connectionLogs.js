const {
    connectionLogs: ConnectionLogs,
} = require('app/logsModels/models/models');
const log = require('app/helpers/logger');

module.exports.create = async (type, kioskId, ip, isMobile) => {
    try {
        const payload = {
            kioskId,
            connectedAt: type === 'connection' ? new Date() : null,
            disconnectedAt: type === 'disconnect' ? new Date() : null,
            ip,
            isMobile
        };
        await ConnectionLogs.create(payload);
    } catch(err) {
        log.error('Error in create ConnectionLogs');
    }
};
