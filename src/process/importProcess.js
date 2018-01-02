#!/usr/bin/env node

const models = require('../../models/index');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const express = require('express');
const bodyParser = require('body-parser');

var util = require('util');

// Simple way of having nice logs
function log(message) {
    var prefix = (new Date).toISOString();

    if(typeof message === 'object') {
        console.log(prefix + " ▼");
        console.log(util.inspect(message, {showHidden: false, depth: 10}));
    } else {
        console.log(prefix + " -> " + message);
    }
}

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// default port
app.listen(config.import.port);

app.get('/alive', function handleAlive(req, res) {
    res.send('yes');
});

app.post('/receive_results', function handleReceiveResults(req, res) {
    log("Got results!");
    var body = req.body;

    const model = models.Users.build({
        FirstName: body.firstname,
        LastName: body.lastname,
        WalletId: body.walletid,
        Phone: body.phone,
        EMail: body.email,
    });
    model.save();

    //TODO ensure uniqueness here or later wenn sending coin to accounts?

    res.send('OK');
});
