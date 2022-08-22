'use strict';

const auth = require('app/middlewares/auth');
const device = require('app/controllers/device');

module.exports = (app) => {
    app.route('/device/kiosks/:id/opendoor')
        .put(auth.authenticate, device.openDoor);
    app.route('/device/kiosks/:id/allowConnection')
        .put(auth.authenticate, device.allowConnection);
    app.route('/device/kiosks/:id/disallowConnection')
        .put(auth.authenticate, device.disallowConnection);
};