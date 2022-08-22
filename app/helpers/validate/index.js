'use strict';

const AJV = require('ajv').default;
const ajvFormats = require('ajv-formats');
const ajvKeywords = require('ajv-keywords');

const ajv = new AJV({ coerceTypes: true, useDefaults: true });
ajvFormats(ajv);
ajvKeywords(ajv);
/**
 * Validator ext methods
 */
module.exports = {
    isSchemeValid: (scheme, data) => {
        return new Promise((resolve, reject) => {
            try {
                let validate = ajv.compile(scheme);//returns true or false
                if (validate(data) === false) {
                    return reject({
                        message: 'Request scheme is invalid.',
                        status: 422,
                        errors: validate.errors
                    });
                }
                return resolve(data);
            }
            catch (err) {
                return reject(err);
            }
        });
    }
};