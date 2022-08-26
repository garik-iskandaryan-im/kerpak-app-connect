const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

const YEREVAN_TIME_ZONE = '+04:00';

const collectDateString = (dateTime, format, timezone = YEREVAN_TIME_ZONE) => moment(dateTime).utcOffset(timezone).format(format).toString();

const decryptStringWithRsaPrivateKey = (toDecrypt, relativeOrAbsolutePathToPrivateKey) => {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPrivateKey);
    const privateKey = fs.readFileSync(absolutePath, 'utf8');
    const buffer = Buffer.from(toDecrypt, 'base64');
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey.toString(),
            passphrase: '',
        },
        buffer,
    );
    return decrypted.toString('utf8');
};

const encryptStringWithRsaPublicKey = (toEncrypt, relativeOrAbsolutePathToPublicKey) => {
    const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
    const publicKey = fs.readFileSync(absolutePath, 'utf8');
    const buffer = Buffer.from(toEncrypt, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
};

module.exports = {
    collectDateString,
    decryptStringWithRsaPrivateKey,
    encryptStringWithRsaPublicKey
};