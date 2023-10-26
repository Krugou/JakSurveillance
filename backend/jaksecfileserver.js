"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var app = (0, express_1["default"])();
var http = (0, http_1.createServer)(app);
// server's adjustable settings
var port = 3001;
var startTime = new Date();
console.log(' Backend chat/frontend server start time: ' + startTime.toLocaleString());
app.use(express_1["default"].static('JakSec'));
app.get('*', function (req, res) {
    res.sendFile('index.html', { root: 'JakSec' });
});
http.listen(port, function () {
    console.log('JakSec backend frontend server Started at: http://localhost:' +
        port +
        '/index.html ');
});
