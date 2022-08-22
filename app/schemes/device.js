module.exports = {
    openDoor: {
        type: 'object',
        properties: {
            kioskId: { type: 'number' },
            firebaseRegistrationToken: { type: 'string' }
        },
        required: ['kioskId'],
        additionalProperties: false
    },
    allowConnection: {
        type: 'object',
        properties: {
            kioskId: { type: 'number' }
        },
        required: ['kioskId'],
        additionalProperties: false
    },
    disallowConnection: {
        type: 'object',
        properties: {
            kioskId: { type: 'number' }
        },
        required: ['kioskId'],
        additionalProperties: false
    },
};
