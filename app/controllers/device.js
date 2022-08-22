const { device: deviceValidator } = require('app/schemes');
const { isSchemeValid } = require('app/helpers/validate');
const log = require('app/helpers/logger');
const deviceManger = require('app/deviceManager/deviceManager.js');

module.exports.openDoor = async (req, res) => {
    try {
        const payload = { kioskId: req.params.id, ...req.body };
        try {
            await isSchemeValid(deviceValidator.openDoor, { kioskId: req.params.id, ...req.body });
        } catch (err) {
            log.error(err, 'device::openDoor::validation');
            return res.status(400).json({ success: false, message: 'validation error' });
        }
        const { kioskId, firebaseRegistrationToken } = payload;
        const response = await deviceManger.openDoor(kioskId, firebaseRegistrationToken);
        return res.json(response);
    } catch (error) {
        log.error(error, 'device::openDoor');
        return res.status(500).json({ message: 'Kiosk open door fail' });
    }
};

module.exports.allowConnection = async (req, res) => {
    try {
        const payload = { kioskId: req.params.id };
        try {
            await isSchemeValid(deviceValidator.allowConnection, payload);
        } catch (err) {
            log.error(err, 'device::allowConnection::validation');
            return res.status(400).json({ success: false, message: 'validation error' });
        }
        const { kioskId } = payload;
        await deviceManger.allowConnection(kioskId);;
        return res.json({ success: true });
    } catch (error) {
        log.error(error, 'device::allowConnection');
        return res.status(500).json({ success: false });
    }
};

module.exports.disallowConnection = async (req, res) => {
    try {
        const payload = { kioskId: req.params.id };
        try {
            await isSchemeValid(deviceValidator.disallowConnection, payload);
        } catch (err) {
            log.error(err, 'device::disallowConnection::validation');
            return res.status(400).json({ success: false, message: 'validation error' });
        }
        const { kioskId } = payload;
        await deviceManger.disallowConnection(kioskId);
        return res.json({ success: true });
    } catch (error) {
        log.error(error, 'device::disallowConnection');
        return res.status(500).json({ success: false });
    }
};