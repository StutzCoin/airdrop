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
    var answers = req.body.form_response.answers;

    // see https://developer.typeform.com/webhooks/example-response/
    const model = models.Users.build({
        FirstName: answers[0].text,
        LastName: answers[1].text,
        EMail: answers[2].email,
        Phone: answers[3].text,
        WalletId: answers[4].text,
    });
    model.save();

    //TODO ensure uniqueness here or later wenn sending coin to accounts?

    res.send('OK', 200);
});

app.post('/validateEmail', function handleReceiveResults(req, res) {
    log("Got results!");
    var answers = req.body.form_response.answers;

    // see https://developer.typeform.com/webhooks/example-response/
    //TODO add code

    res.send('OK', 200);
});

app.post('/validateSMS', function handleReceiveResults(req, res) {
    log("Got results!");
    var answers = req.body.form_response.answers;

    // see https://developer.typeform.com/webhooks/example-response/
    //TODO add code

    res.send('OK', 200);
});
