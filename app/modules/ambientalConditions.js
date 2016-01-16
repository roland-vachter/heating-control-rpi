"use strict";

const db = require('./db');
const env = require('../../env');
const outsideConditions = require('./outsideConditions');
const insideConditions = require('./insideConditions');
const socket = require('../socket');

let saveInterval = env.ambientalSaveInterval || 10; // minutes
let currentValues;

db.getConnection(env.mongo.uri, (err, connection) => {
	connection.collection('ambientalConditions').find().sort({
		_id: -1
	}).limit(1).toArray((err, dbEntries) => {
		if (err) {
			throw err;
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
	console.log(lastDate);

	if (lastDate === null) {
		startRefresh();
	} else {
		setTimeout(startRefresh, lastDate.getTime() + saveInterval * 60 * 1000 - new Date().getTime());
	}
}

function startRefresh () {
	console.log('startRefresh');

	refresh();
	setInterval(refresh, saveInterval * 60 * 1000);
}

function refresh () {
	outsideConditions.get().then((outData) => {
		insideConditions.get().then((inData) => {
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


			save();
		});
	});
}

function save () {
	console.log('save');

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


exports.getCurrentConditions = function () {
	return currentValues;
};
