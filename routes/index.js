"use strict";

var express = require('express');
var router = express.Router();

var ambientalConditions = require('../app/modules/ambientalConditions');

router.get('/ambiental-conditions', function (req, res, next) {
	var conditions = ambientalConditions.getCurrentConditions();

	res.json(conditions);
});

router.get('/ip', function(req, res, next) {
	res.send(req.app.get('ip'));
});

module.exports = router;
