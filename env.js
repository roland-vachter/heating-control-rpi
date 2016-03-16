"use strict";

module.exports = {
	apiKeys: {
		registry: process.env.REGISTRY_API_KEY
	},
	registryAddress: process.env.REGISTRY_APP_ADDRESS,
	inDevMode: process.env.DEV_MODE_ON === "true" ? true : false,
	crypto: {
		key: process.env.CRYPTO_KEY
	},
	mongo: {
		uri: process.env.MONGO_URI
	},
	dhtSensor: {
		pin: process.env.DHT_SENSOR_PIN
	},
	lcd: {
		cols: process.env.LCD_COLS,
		rows: process.env.LCD_ROWS,
		rs: process.env.LCD_RS_GPIO,
		e: process.env.LCD_E_GPIO,
		data: [
			process.env.LCD_DATA4_GPIO,
			process.env.LCD_DATA5_GPIO,
			process.env.LCD_DATA6_GPIO,
			process.env.LCD_DATA7_GPIO
		],
		enable: process.env.LCD_ENABLE === 'true'
	}
};
