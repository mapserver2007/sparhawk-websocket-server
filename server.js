/**
 * server.js
 * version: 0.0.1 (2013/07/11)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Ryuichi TANAKA [mapserver2007@gmail.com]
 */

var PORT = process.env.PORT || 9224;
var WS_PROTOCOL = 'sparhawk_ws';
var REST_PROTOCOL = 'sparhawk_rest';

var connectionWithChrome = null;

// Logger
var log4js = require('log4js');
log4js.configure('./log4js.json');
var logger = log4js.getLogger('dataFile');
logger.setLevel('INFO');

// WebSocket
var WebSocketServer = require('ws').Server;
var server = new WebSocketServer({
    port: PORT,
    protocol: [WS_PROTOCOL, REST_PROTOCOL]
});

var close = function(code) {
    logger.info("connecton closed: CODE [" + code + "]");
};

server.on('connection', function(ws) {
    // Chromeからの接続
    if (ws.protocol === WS_PROTOCOL) {
        logger.info("connected by chrome.");
        connectionWithChrome = ws;
        ws.on('close', close);
    }
    // RESTサーバからの接続
    else if (ws.protocol === REST_PROTOCOL) {
        logger.info("connected by rest server.");
        ws.on('close', close);
        ws.on('message', function(data) {
            if (connectionWithChrome !== null) {
                logger.info("send data from rest server to chrome.");
                connectionWithChrome.send(JSON.stringify(data));
            }
        });
    }
});