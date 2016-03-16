"use strict";

const EventEmitter = require('events');
const evts = new EventEmitter();

const needle = require('needle');

let lastValues = {
	temperature: NaN,
	humidity: NaN
};

function update () {
	needle.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22Cluj-Napoca%22)%20and%20u%3D%27c%27&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function (err, response) {
		if (err) {
			console.log(err);
			return;
		}

		try {
			let temperature = parseInt(response.body.query.results.channel.item.condition.temp, 10);
			let humidity = parseInt(response.body.query.results.channel.atmosphere.humidity, 10);

			lastValues.temperature = temperature;
			lastValues.humidity = humidity;

			evts.emit('change', lastValues);
		} catch (e) {
			console.log(e);
		}
	});
}
setInterval(() => {
	update();
}, 10 * 60 * 1000);
update();

exports.get = function () {
	return lastValues;
};

exports.evts = evts;
