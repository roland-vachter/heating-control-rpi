"use strict";

const EventEmitter = require('events');
const evts = new EventEmitter();

const env = require('../../env');
const outsideConditions = require('./outsideConditions');
const insideConditions = require('./insideConditions');

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
