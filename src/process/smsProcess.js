#!/usr/bin/env node

const models = require('../../models/index');

const Logger = require('../modules/logger');
const logger = new Logger();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const SendSMS = require('../modules/sendSMS');
const sendSMS = new SendSMS();

const Translations = require('../modules/i18n');
const translations = new Translations();

const uuidv5 = require('uuid/v5');
const i18n = require('i18n');
const util = require('util');


function smsProcess() {

    function seconds(val) {
        return val;
    }

    function minutes(val) {
        return val * seconds(60);
    }

    function hours(val) {
        return val * minutes(60);
    }

    function days(val) {
        return val * hours(24);
    }

    function weeks(val) {
        return val * days(7);
    }

    function years(val) {
        return val * days(365);
    }

//TODO use mocking instead of unit test boolean
    this.sms = async function sms(unitTest = false) {
        return new Promise(function (resolve, reject) {

            models.Users.findAll({
                where: {
                    Status: 'EmailValidated',
                },
                limit: config.readLimit
            }).then(users => {
                logger.log('info', 'Found ' + users.length + ' users to process.');
                users.forEach(user => {
                    translations.setLocale(user.Locale);

                    // Generate unique number valid 15 minutes
                    user.SmsKey = uuidv5(config.coin.home, uuidv5.URL);


                    // TODO bad only for unit test
                    let expire = new Date() + minutes(config.sms.expireInMinutes);
                    if (env === 'development') {
                        expire = years(config.email.expireInMinutes);
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
                        let success = true;
                        if (!unitTest) {
                            sendSMS.sendSMS(user.Phone, content).then((error) => {
                                if (error) {
                                    success = false;
                                }
                            });
                        }
                        if (success) {
                            user.SmsSentDate = new Date();
                            user.SmsSent = true;
                            user.Status = 'SmsSent';

                            user.save().then(() => {
                                logger.log('audit', 'SMS code sent for user ' + user.Name);
                                resolve(content);
                            });
                        }
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
}

module.exports = smsProcess;
