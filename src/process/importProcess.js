#!/usr/bin/env node

const models = require('../../models/index');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const express = require('express');
const bodyParser = require('body-parser');

var util = require('util');
import {sendEmail} from '../../src/modules/sendEmail';

// Simple way of having nice logs
function log(message) {
    var prefix = (new Date).toISOString();

    if (typeof message === 'object') {
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

/**
 * WebHook for form A
 */
app.post('/userRegistered', function handleReceiveResults(req, res) {
    log("Got results!");
    var answers = req.body.form_response.answers;

    // see https://developer.typeform.com/webhooks/example-response/
    const model = models.Users.build({
        FirstName: answers[0].text,
        LastName: answers[1].text,
        EMail: answers[2].email,
        Phone: answers[3].text,
        WalletId: answers[4].text,
        IsNew: true,
    });
    model.save();

    //TODO ensure uniqueness here or later wenn sending coin to accounts?

    res.send('OK', 200);
});

/**
 * WebHook for form B
 */
app.post('/validateEmail', function handleReceiveResults(req, res) {
    log("Got results!");
    var answers = req.body.form_response.answers;

    const emailKey = answers[0].text;

    // search for user matching
    models.Users.findAll({
        where: {
            IsNew: false,
            EmailSent: true,
            EmailKey: emailKey,
        },
        limit: 1
    }).then(users => {
        const user = users[0];

        // set field
        user.EmailValidated = true;
        user.save().then(() => {
            const subject = 'Stutz coin: email validated';
            sendEmail(user, 'email-validated.pug', subject).then((success) => {
            });
        })
    });

    res.send('OK', 200);
});

/**
 * WebHook for form C
 */
app.post('/validatePhone', function handleReceiveResults(req, res) {
    log("Got results!");
    var answers = req.body.form_response.answers;

    // see https://developer.typeform.com/webhooks/example-response/
    const smsKey = answers[0].text;

    // search for user matching
    models.Users.findAll({
        where: {
            IsNew: false,
            SmsSent: true,
            SmsKey: smsKey,
        },
        limit: 1
    }).then(users => {
        const user = users[0];

        // set field
        user.PhoneValidated = true;
        user.save().then(() => {
            const subject = 'Stutz coin: registration completed';
            sendEmail(user, 'registration-completed.pug', subject).then((success) => {
            });
        })
    });

    res.send('OK', 200);
});
