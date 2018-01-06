#!/usr/bin/env node

const models = require('../../models/index');
import logger from '../modules/logger';
import {duration} from '../modules/time';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

import sendSMS from '../modules/sendSMS';
import translations from '../../src/modules/i18n';

const uuidv5 = require('uuid/v5');
const i18n = require('i18n');
const util = require('util');

//TODO use mocking instead of unit test boolean
export async function sms(unitTest = false) {
    return new Promise(function (resolve, reject) {

        models.Users.findAll({
            where: {
                EMailValidated: true,
                PhoneValid: true,
            },
            limit: config.readLimit
        }).then(users => {
            logger.log('info', 'Found ' + users.length + ' users to process.');
            users.forEach(user => {
                translations.setLocale(user.Locale);

                // Generate unique number valid 15 minutes
                user.SmsKey = uuidv5(config.coin.home, uuidv5.URL);


                // TODO bad only for unit test
                let expire =  new Date() + duration.minutes(config.sms.expireInMinutes);
                if (env === 'development') {
                    expire = duration.years(config.email.expireInMinutes);
                }
                user.SmsKeyValidTo = expire;

                //  TODO move out of here
                // for PUG
                i18n.configure({
                    locales: config.locales,
                    directory: __dirname + '/../../locales',
                    autoReload: true,
                    logDebugFn: function (msg) {
                        logger.log('debug', msg);
                    },
                    logErrorFn: function (msg) {
                        logger.log('error', msg);
                    },
                    register: global,
                    syncFiles: true,
                    objectNotation: true
                });
                i18n.setLocale(user.Locale);
                // end move out

                const url = config.sms.formUrl + '?key=' + user.SmsKey + '&firstname=' + user.FirstName + '&lastname=' + user.LastName;  //use type-form hidden fields
                const content = util.format(translations.__('sms.text'), user.SmsKey, user.SmsKeyValidTo, url);

                try {
                    if (!unitTest) {
                        sendSMS(user.Phone, content);
                    }
                    user.SmsSentDate = new Date();
                    user.SmsSent = true;

                    user.save().then( () => {
                        logger.log('audit', 'SMS code sent for user ' + user.Name);
                        resolve(content);
                    });
                }
                catch (err) {
                    // TODO handle error
                    //If the Twilio API returns a 400 or a 500 level HTTP response, the twilio-node library will include
                    // information in the error parameter of the callback. 400-level errors are normal during API operation
                    // ("Invalid number", "Cannot deliver SMS to that number", for example) and should be handled appropriately
                    logger.log('error', err);
                    reject(err);
                }
            });

        }).catch(err => {
            logger.log('error', err);
            reject(err);
        });
    });
}
