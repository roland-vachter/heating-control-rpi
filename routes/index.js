"use strict";

var express = require('express');
var router = express.Router();
var ownIpService = require('../app/updateOwnIp');
var socket = require('../app/socket.js');

var ambientalConditions = require('../app/modules/ambientalConditions');

router.get('/ambiental-conditions', function (req, res, next) {
	var conditions = ambientalConditions.get();

	res.json(conditions);
});
ambientalConditions.evts.on('change', function (data) {
	socket().emit('ambiental-conditions', data);
});

router.get('/ambiental-past-conditions', function (req, res, next) {
	/*var start = req.query.start && parseInt(req.query.start, 10) > 0 ? new Date(parseInt(req.query.start, 10)) : null;
	var end = req.query.end && parseInt(req.query.end, 10) > 0 ? new Date(parseInt(req.query.end, 10)) : null;

	ambientalConditions.getPastConditions(start, end).then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json({
			error: err.getMessage()
		});
	});*/

	res.sendStatus(404);
});

router.get('/ip', function(req, res, next) {
	res.send(ownIpService.getIp());
});

module.exports = router;
