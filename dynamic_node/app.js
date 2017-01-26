var express = require('express')
var app = express()

var os = require('os');
var ifaces = os.networkInterfaces();

var rndm = Math.random();

app.get('/', function (req, res) {
  res.send('Hello World: ' + rndm);
})

app.listen(80, function () {
  console.log('Example app listening on port 80!')
})
