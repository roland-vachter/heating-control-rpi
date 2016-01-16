"use strict";

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const EventEmitter = require('events');

const connections = {};
const evts = new EventEmitter();
let connInProgress = false;


function getConnection (uri, callback) {
	if (typeof callback !== 'function') {
		throw new Error("db.getConnection: callback not provided");
	}

	if (connections[uri]) {
		callback(null, connections[uri]);
		return;
	}


	let eventHandled = false;
	evts.once('complete', function (err, conn) {
		if (!eventHandled) {
			eventHandled = true;

			callback(err, conn);
		}
	});


	if (!connInProgress) {
		MongoClient.connect(uri, function(err, dbConn) {
			if (err) {
				evts.emit('complete', err);
				return;
			}

			dbConn.on('close', function() {
				connections[uri] = null;

				if (this._callBackStore) {
					for(var key in this._callBackStore._notReplied) {
						if (this._callBackStore._notReplied.hasOwnProperty(key)) {
							this._callHandler(key, null, 'Connection Closed!');
						}
					}
				}
			});

			connections[uri] = dbConn;
			evts.emit('complete', null, dbConn);
		});

		setTimeout(function () {
			evts.emit('complete', {message: "Connection timeout"});
		}, 10000);
	}
}

exports.getConnection = getConnection;
