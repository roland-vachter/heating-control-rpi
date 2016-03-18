"use strict";

const env = require('../../env');

if (env.lcd.enable) {
	let Lcd;
	if (env.inDevMode) {
		Lcd = require('gpio-peripherals-test').lcd;
	} else {
		Lcd = require('lcd');
	}

	let lcd = new Lcd({
		cols: env.lcd.cols,
		rows: env.lcd.rows,
		rs: env.lcd.rs,
		e: env.lcd.e,
		data: env.lcd.data
	});

	setTimeout(function () {
		lcd.noCursor();
		lcd.noAutoscroll();
		lcd.noBlink();

		let printLcd = function (data) {
			lcd.clear(function () {
				lcd.home(function () {
					lcd.setCursor(0, 0);
					lcd.print('I: '+
								("     " + data.inside.temperature.toFixed(1)).slice(-5) + 'C  ' +
								("   " + data.inside.humidity).slice(-3) + '%',
						() => {
							lcd.setCursor(0, 1);
							lcd.print('O: '+
								("     " + data.outside.temperature.toFixed(1)).slice(-5) + 'C  ' +
								("   " + data.outside.humidity).slice(-3) + '%');
						}
					);
				});
			});
		};

		const ambientalConditions = require('./ambientalConditions');
		let data = ambientalConditions.get();
		printLcd(data);

		ambientalConditions.evts.on('change', function (data) {
			printLcd(data);
		});
	}, 1000);
}
