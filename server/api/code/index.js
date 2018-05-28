'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./code.controller');

router.post('/code',  controller.genCode);

module.exports = router;
