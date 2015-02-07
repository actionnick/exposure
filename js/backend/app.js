var express = require("express");
var app = express();

app.use(express.static(__dirname + '/../../'));

// Create HTTP server with your app
var http = require("http");
var server = http.createServer(app)

// Listen to port 3000 
server.listen(8000);
