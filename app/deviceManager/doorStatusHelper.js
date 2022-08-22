
const {
    kioskSessions: KioskSessions,
} = require('app/models/models');
const {
    lockStatusLogs: LockStatusLogs,
} = require('app/logsModels/models/models');

const log = require('app/helpers/logger');

module.exports.handleLockStatus = async (data, callback) => {
    try {
        const session = await KioskSessions.findOne({
            where: { kioskId: data.kioskId },
            order: [['id', 'DESC']]
        });
        if (data.doorStatus) {
            if (!session) {
                log.error(`no any session for provided kiosk. kioskID = ${data.kioskId}`, 'LockStatusLogs::handleLockStatus');
            } else {
                await LockStatusLogs.create({ openDate: data.date, kioskId: data.kioskId, sessionId: session.id });
            }
        } else {
            const lockStatusLog = await LockStatusLogs.findOne({
                where: { kioskId: data.kioskId },
                order: [['id', 'DESC']]
            });

            if (lockStatusLog) {
                if (lockStatusLog.closeDate) {
                    log.error(`log already have  closeDate. kioskId = ${data.kioskId}, date=${data.date}`, 'LockStatusLogs::handleLockStatus');
                } else {
                    await LockStatusLogs.update({ closeDate: data.date }, { where: { id: lockStatusLog.id } });
                }
            } else {
                log.error(`no log found. kioskId = ${data.kioskId}, date=${data.date}`, 'LockStatusLogs::handleLockStatus');
            }
        }
        if (callback) {
            callback();
        }
    } catch (err) {
        log.error(err, 'LockStatusLogs::handleLockStatus');
    }
};