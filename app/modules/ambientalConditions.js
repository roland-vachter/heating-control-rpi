"use strict";

const db = require('./db');
const env = require('../../env');
const outsideConditions = require('./outsideConditions');
const insideConditions = require('./insideConditions');
const socket = require('../socket');

let refreshInterval = 10; // minutes
let saveInterval = 30;
let currentValues;

db.getConnection(env.mongo.uri, (err, connection) => {
	connection.collection('ambientalConditions').find().sort({
		_id: -1
	}).limit(1).toArray((err, dbEntries) => {
		if (err) {
			init(null, null);
			return;
		}

		if (dbEntries && dbEntries.length) {
			currentValues = {
				inside: {
					temperature: dbEntries[0].i.t,
					humidity: dbEntries[0].i.h
				},
				outside: {
					temperature: dbEntries[0].o.t,
					humidity: dbEntries[0].o.h
				}
			};

			init(currentValues, dbEntries[0]._id);
		} else {
			init(null, null);
		}
	});
});


function init (lastValues, lastDate) {
	startRefresh(() => {
		if (lastDate === null) {
			startSave();
		} else {
			setTimeout(startSave, lastDate.getTime() + saveInterval * 60 * 1000 - new Date().getTime());
		}
	});
}

function startRefresh (callback) {
	refresh(callback);
	setInterval(refresh, refreshInterval * 60 * 1000);
}

function startSave () {
	save();
	setInterval(save, saveInterval * 60 * 1000);
}

function refresh (callback) {
	outsideConditions.get().then((outData) => {
		insideConditions.get().then((inData) => {
			if (outData && inData) {
				currentValues = {
					inside: {
						temperature: inData.temperature,
						humidity: inData.humidity
					},
					outside: {
						temperature: outData.temperature,
						humidity: outData.humidity
					}
				};

				socket().emit('ambiental-conditions', currentValues);
			}

			callback();
		});
	}).catch((e) => {
		console.log('error', e);

		callback();
	});
}

function save () {
	if (currentValues) {
		db.getConnection(env.mongo.uri, (err, connection) => {
			connection.collection('ambientalConditions').insert({
				_id: new Date(),
				i: {
					t: currentValues.inside.temperature,
					h: currentValues.inside.humidity
				},
				o: {
					t: currentValues.outside.temperature,
					h: currentValues.outside.humidity
				}
			}, currentValues);
		});
	}
}


exports.getCurrentConditions = function () {
	return currentValues;
};

exports.getPastConditions = function (startDate, endDate) {
	return new Promise((resolve, reject) => {
		if (!startDate) {
			startDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
		}

		if (!endDate) {
			endDate = new Date();
		}


		db.getConnection(env.mongo.uri, (err, connection) => {
			connection.collection('ambientalConditions').find({
				_id: {
					$gt: startDate,
					$lt: endDate
				}
			}).sort({
				_id: 1
			}).toArray((err, dbEntries) => {
				if (err) {
					reject(err);
					return;
				}

				let reformatted = dbEntries.map((obj) => {
					return {
						date: obj._id,
						inside: {
							temperature: obj.i.t,
							humidity: obj.i.h
						},
						outside: {
							temperature: obj.o.t,
							humidity: obj.o.h
						}
					};
				});

				resolve(reformatted);
			});
		});
	});
};
