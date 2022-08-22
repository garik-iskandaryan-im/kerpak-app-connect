const express = require('express');
const router = express.Router();

const { getPing } = require('app/controllers/ping');

router.get('/', getPing);

module.exports = router;