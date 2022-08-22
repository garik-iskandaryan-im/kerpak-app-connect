const { SES } = require('aws-sdk');
const log = require('app/helpers/logger');
const { s3: { KEY, SECRET, SES: { REGION, SOURCE } } } = require('app/settings');

const ses = new SES({
    secretAccessKey: SECRET,
    accessKeyId: KEY,
    region: REGION
});

const sendEmail = async (emails, bccEmails, subject, body_text, sender, isTemplateHtml = false) => {
    try {
        const charset = 'UTF-8';
        let source = SOURCE;
        if (sender) {
            source = sender;
        }
        let params = {
            Source: source,
            Destination: {
                ToAddresses: emails,
                BccAddresses: bccEmails,
            },
            Message: {
                Subject: {
                    Data: subject,
                    Charset: charset
                },
                Body: {
                    [isTemplateHtml ? 'Html' : 'Text']: {
                        Data: body_text,
                        Charset: charset
                    }
                }
            }
        };
        ses.sendEmail(params, function (err, data) {
            if (err) {
                log.error(err, 'aws::email::sendEmail::err');
            } else {
                log.info(data, 'aws::email::sendEmail');
            }
        });
        return true;
    } catch (err) {
        log.error(err, 'aws::email::sendEmail');
        return false;
    }
};

module.exports = {
    sendEmail
};