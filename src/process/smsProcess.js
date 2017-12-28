#!/usr/bin/env node

const models = require('../../models/index');
import logger from '../modules/logger';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];


function getRandomNumber() {
    var min = 10000;
    var max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export async function sendEmail() {
    logger.log('info', 'Send email to users');

    const users = models.Users.findAll({
        where: {
            EMailOK: true,
            EmailSent: true,
            PhoneOK: true,
        },
        limit: config.readLimit
    });

    logger.log('info', 'Found ' + users.length + ' users to process.');
    users.forEach(user => {
        // Generate unique number valid 15 minutes
        user.SmsKey = getRandomNumber();
        user.SmsKeyValidTo = new Data() + duration.minutes(15);

        //send SMS
        // TODO

        user.SmsSent = new Date();

        // persist to database
        user.save();
    });
}
