// server.js

// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var http = require("http");
var https = require("https");
var mysql = require('mysql');
// configuration =================

//mongoose.connect('mongodb://node:node@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());


var connection = mysql.createConnection({
    //host: 'vps30624.vps.ovh.ca',
    host: 'localhost',
    user: 'root',
    password: 'ovodata',
    database: 'JJLifts'
});

connection.connect();




app.get('/query', function(req, res) {
    var query = req.query.query;

    connection.query(query, function(err, rows, fields) {
        if (err) throw err;
        res.send(rows);
    });

});

app.get('/*', function(req, res) {
    res.sendfile('./public/pages/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});





// listen (start app with node server.js) ======================================
app.listen(80);
console.log("App listening on port 80");

/////////////////////////////////////////My Sql stuff////////////////////////////////////////////