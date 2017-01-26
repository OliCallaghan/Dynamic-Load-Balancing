const fs = require('fs');
var express = require('express');
var app = express();

var docker = require('./docker.js');

app.get('/', function (req, res) {
	fs.readFile('pages/index.html', 'utf-8', function (err, data) {
		res.send(data);
	});
});

app.get('/rescale', function (req, res) {
	docker.rescale(req.query.nodes, function() {
		console.log('rescaled');
	});
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});
