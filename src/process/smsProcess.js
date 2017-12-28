#!/usr/bin/env node

const models = require('../../models/index');
import logger from '../modules/logger';
import {duration} from '../modules/time';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

import {sendSMS} from '../modules/sendSMS';

const min = 10000;
const max = 99999;

function getRandomNumber() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//TODO use mocking instead of unit test boolean
export async function sms(unitTest = false) {
    return new Promise(function (resolve, reject) {
        models.Users.findAll({
            where: {
                EMailOK: true,
                EmailSent: true,
                PhoneOK: true,
            },
            limit: config.readLimit
        }).then(users => {
            logger.log('info', 'Found ' + users.length + ' users to process.');
            users.forEach(user => {
                // Generate unique number valid 15 minutes
                user.SmsKey = getRandomNumber();
                user.SmsKeyValidTo = new Date() + duration.minutes(15);

                // TODO translations, use template engine?
                const content = 'Your Stutz Code is ' + user.SmsKey + ' valid up to ' + user.SmsKeyValidTo + ' Enter code Here: ' + config.checkCodeUrl;

                try {
                    if (!unitTest) {
                        sendSMS(user.Phone, content);
                    }
                    user.SmsSentDate = new Date();
                    user.SmsSent = true;
                    user.save();
                    logger.log('audit', 'SMS code sent for user ' + user.Name);
                }
                catch (err) {
                    // TODO handle error
                    //If the Twilio API returns a 400 or a 500 level HTTP response, the twilio-node library will include
                    // information in the error parameter of the callback. 400-level errors are normal during API operation
                    // ("Invalid number", "Cannot deliver SMS to that number", for example) and should be handled appropriately
                    logger.log('error', err);

                }
            });
            resolve(true);
        }).catch(err => {
            logger.log('error', err);
            reject(err);
        });
    });
}
