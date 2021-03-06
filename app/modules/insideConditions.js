"use strict";

const EventEmitter = require('events');
const evts = new EventEmitter();

const env = require('../../env');
let dht;
if (env.inDevMode) {
	dht = require('gpio-peripherals-test').dht;
} else {
	dht = require('rpi-dht-sensor');
}

let lastValues = {
	temperature: NaN,
	humidity: NaN
};

let dhtInstance = new dht.DHT22(env.dhtSensor.pin);

function update () {
	let data = dhtInstance.read();

	let temperature = Math.round(data.temperature * 10) / 10;
	let humidity = parseInt(data.humidity, 10);

	if (lastValues.temperature !== temperature || lastValues.humidity !== humidity) {
		lastValues.temperature = temperature;
		lastValues.humidity = humidity;

		evts.emit('change', lastValues);
	}
}
setInterval(() => {
	update();
}, 60 * 1000);
update();

exports.get = function () {
	return lastValues;
};

exports.evts = evts;
