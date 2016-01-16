"use strict";

exports.get = function () {
	return new Promise((resolve, reject) => {
		resolve({
			temperature: "-",
			humidity: "-"
		});
	});
};
