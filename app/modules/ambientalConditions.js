"use strict";

const EventEmitter = require('events');
const evts = new EventEmitter();

const env = require('../../env');
const outsideConditions = require('./outsideConditions');
const insideConditions = require('./insideConditions');

let refreshInterval = 1; // minutes
let saveInterval = 30;
let currentValues = {
	inside: {
		temperature: '-',
		humidity: '-'
	},
	outside: {
		temperature: '-',
		humidity: '-'
	}
};

let outData = outsideConditions.get();
currentValues.outside.temperature = outData.temperature;
currentValues.outside.humidity = outData.humidity;

outsideConditions.evts.on('change', (data) => {
	currentValues.outside.temperature = data.temperature;
	currentValues.outside.humidity = data.humidity;

	evts.emit('change', currentValues);
});

let inData = insideConditions.get();
currentValues.inside.temperature = inData.temperature;
currentValues.inside.humidity = inData.humidity;

insideConditions.evts.on('change', (data) => {
	currentValues.inside.temperature = data.temperature;
	currentValues.inside.humidity = data.humidity;

	evts.emit('change', currentValues);
});


exports.get = function () {
	return currentValues;
};

exports.evts = evts;


/*db.getConnection(env.mongo.uri, (err, connection) => {
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
});*/

/*init();
function init (lastValues, lastDate) {
	startRefresh(() => {
		if (lastDate === null) {
			startSave();
		} else {
			setTimeout(startSave, lastDate.getTime() + saveInterval * 60 * 1000 - new Date().getTime());
		}
	});
}*/

/*function startSave () {
	save();
	setInterval(save, saveInterval * 60 * 1000);
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
}*/

/*exports.getPastConditions = function (startDate, endDate) {
	return new Promise((resolve, reject) => {
		if (!startDate) {
			startDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
		}

		if (!endDate) {
			endDate = new Date();
		}

		resolve([]);

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
};*/
