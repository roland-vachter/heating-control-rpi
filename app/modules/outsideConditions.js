"use strict";

const cheerio = require('cheerio');
const needle = require('needle');

exports.get = function () {
	return new Promise((resolve, reject) => {
		needle.get('http://vremeacluj.ro', function (err, response) {
			if (err) {
				console.log(err);
				reject({
					error: "Error reading the page."
				});
				return;
			}

			var $ = cheerio.load(response.body, {
				decodeEntities: false
			});
			var temperature = $('#main-weather .degree').html();
			var humidity = parseInt($('#main-weather .t3 .sphere').html(), 10);

			temperature = parseInt(temperature.substr(0, temperature.length - 1), 10);
			resolve({
				temperature: temperature,
				humidity: humidity
			});
		});
	});
};
