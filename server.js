/**
 * server.js
 * version: 0.0.2 (2013/07/12)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var WS_PORT = 9224;
var REST_PORT = 9225;

// Logger
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('dataFile');
logger.setLevel('INFO');

// WebSocket
var WebSocketServer = require('ws').Server;
var server = new WebSocketServer({
    port: WS_PORT
});

var close = function(code) {
    logger.info("connecton closed: CODE [" + code + "]");
};

var connection = null;
server.on('connection', function(ws) {
    connection = ws;
    ws.on('close', function(code) {
        logger.info("connecton closed: CODE [" + code + "]");
    });
});

// REST
var express = require('express');
var app = express();
app.get('/rest/position', function(req, res) {
    var data = {
        lat: req.query.lat,
        lng: req.query.lng
    };
    try {
        connection.send(JSON.stringify(data));
        res.send(200);
    }
    catch (e) {
        logger.error(e.message);
        throw e;
    }

});
app.listen(REST_PORT);