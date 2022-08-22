const ping = require('./ping');

const express = require('express');
const router = express.Router();

require('./device')(router);
router.use('/ping', ping);

module.exports = router;