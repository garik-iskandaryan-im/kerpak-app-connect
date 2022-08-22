const {
    kiosks: Kiosks,
    serviceProviders: ServiceProviders,
} = require('app/models/models');
const {
    kiosksTemperatureStatus: KiosksTemperatureStatus,
    temperatureLogs: TemperatureLogs,
} = require('app/logsModels/models/models');
const {
    getEmailBody,
    getCriticalEmailBody,
} = require('app/helpers/email/adapters/aws');
const { sendEmail } = require('app/services/aws');
const { getKOEmailsForTemperatureAlerts, getSPUsersEmailsForTemperatureAlerts } = require('app/helpers/email/destination');
const { Op } = require('sequelize');
const { collectDateString } = require('app/common/utils');
const moment = require('moment');

const checkForCriticalIssue = async (id, displayName, temperatureLogs, spAccountHolderEmail, superAdminEmails, timezone) => {
    const currentDate = new Date();
    let lastActionDate = new Date(currentDate.getTime() - 45 * 60 * 1000);
    let isCriticalAlert = await KiosksTemperatureStatus.findOne({
        where: {
            kioskId: id,
            isTemperatureAlert: true,
            isTemperatureCriticalAlert: false,
            lastActionDate: {
                [Op.lte]: lastActionDate
            }
        }
    });

    if (isCriticalAlert) {
        let momentDate = moment(isCriticalAlert.lastActionDate).utcOffset(timezone);
        let date = momentDate.format('ddd, MMM DD YYYY');
        let time = momentDate.format('HH:mm');
        let rows = [];
        temperatureLogs.forEach((log) => {
            if (log.error) {
                rows.push(`${collectDateString(log.createdAt, 'ddd, MMM DD YYYY, HH:mm', timezone)}  –  ${log.errorMessage}`);
            } else {
                rows.push(`${collectDateString(log.createdAt, 'ddd, MMM DD YYYY, HH:mm', timezone)}  –  +${log.temperature} ℃`);
            }
        });
        const body = getCriticalEmailBody(displayName, date, time, { row1: rows[0], row2: rows[1], row3: rows[2] });
        await sendEmail(spAccountHolderEmail, superAdminEmails, `[CRITICAL] Kerpak | ${displayName} | Temperature Alert`, body);

        const payload = {
            isTemperatureCriticalAlert: true,
            lastActionDate: new Date(),
            kioskId: id
        };
        await KiosksTemperatureStatus.upsert(payload);
    }
};

const checkTemperatureLog = async (id, temperatureEmail, displayName, serviceProviderId) => {
    const temperatureLogs = await TemperatureLogs.findAll({ where: { kioskId: id }, order: [['createdAt', 'DESC']], limit: 3 });
    let issueState = 0;
    let correctState = 0;
    const highTemperatureLimit = serviceProviderId === 4 ? 15 : 10;
    temperatureLogs.forEach((log) => {
        if (log.error) {
            issueState++;
        } else if (log.temperature > highTemperatureLimit) {
            issueState++;
        } else {
            correctState++;
        }
    });

    const currentSP = await ServiceProviders.findOne({ where: { id: serviceProviderId }, attributes: ['timezone'] });

    const { spCriticalTemperatureAlertEmails } = await getSPUsersEmailsForTemperatureAlerts(serviceProviderId);
    const { koTemperatureEmails, koCriticalTemperatureEmails } = await getKOEmailsForTemperatureAlerts();
    // TO do create envSettings
    if (issueState === 3 && temperatureEmail !== 'issue email was been sent') {
        const title = `Kerpak | ${displayName} | Temperature Alert`;
        const body = getEmailBody(true, displayName, temperatureLogs, currentSP?.timezone);
        await sendEmail(koTemperatureEmails, [], title, body);
        await Kiosks.update({ temperatureEmail: 'issue email was been sent' }, { where: { id } });
        const payload = {
            isTemperatureAlert: true,
            isTemperatureRecovered: false,
            lastActionDate: new Date(),
            kioskId: id
        };
        await KiosksTemperatureStatus.upsert(payload);
    } else if (correctState === 3 && temperatureEmail === 'issue email was been sent') {
        const title = `Kerpak | ${displayName} | Temperature Alert`;
        const body = getEmailBody(false, displayName, temperatureLogs, currentSP?.timezone);
        await sendEmail(koTemperatureEmails, [], title, body);
        await Kiosks.update({ temperatureEmail: 'recovering email was been sent' }, { where: { id } });
        const payload = {
            isTemperatureAlert: false,
            isTemperatureRecovered: true,
            isTemperatureCriticalAlert: false,
            lastActionDate: new Date(),
            kioskId: id
        };
        await KiosksTemperatureStatus.upsert(payload);
    }
    await checkForCriticalIssue(id, displayName, temperatureLogs, spCriticalTemperatureAlertEmails, koCriticalTemperatureEmails, currentSP?.timezone);
};

module.exports = {
    checkTemperatureLog
};
