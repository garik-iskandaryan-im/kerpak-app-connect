
const utils = require('app/common/utils');
const { kerpakConnectClient: { secret, privateKeyPath } } = require('app/settings');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    const secretFromPayload = utils.decryptStringWithRsaPrivateKey(token, privateKeyPath);
    if (secret === secretFromPayload) {
        return next();
    }
    res.status(401);
    return res.send({ message: 'invalid credentials' });
};

module.exports = { authenticate };