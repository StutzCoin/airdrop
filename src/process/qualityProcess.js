#!/usr/bin/env node

const models = require('../../models/index');
const validator = require("email-validator");

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var PNF = require('google-libphonenumber').PhoneNumberFormat;
var PNT = require('google-libphonenumber').PhoneNumberType;

const WAValidator = require('wallet-address-validator');

const Logger = require('../modules/logger');
const logger = new Logger();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const i18n = require('i18n');

const SendEmail = require('../../src/modules/sendEmail');
const sendEmail = new SendEmail();

const Translations = require('../../src/modules/i18n');
const translations = new Translations();

// PNF.E164
const E164 = 0;

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

// end move out

function qualityProcess() {

    this.check = async function check() {
        logger.log('info', 'Quality data check started');
        return new Promise(function (resolve, reject) {
            // Get all new person data
            models.Users.findAll({
                where: {
                    Status: 'IsNew',
                },
                limit: config.readLimit
            }).then(users => {
                if (users.length > 0) {
                    users.forEach(user => {
                        translations.setLocale(user.Locale);
                        i18n.setLocale(user.Locale);

                        const emailValid = validator.validate(user.EMail);
                        if (!emailValid) {
                            user.Status = 'EmailError';
                        }

                        let region = config.sms.regionAllowed[0]

                        const phoneNumber = phoneUtil.parse(user.Phone, region);
                        let phoneValid = phoneUtil.isValidNumberForRegion(phoneNumber, region);
                        if (phoneValid) {
                            logger.log('debug',"valid swiss number");
                            region = config.sms.regionAllowed[0];
                        } else {
                            logger.log('debug',"invalid swiss number, try to parse LI number");
                            const phoneNumber = phoneUtil.parse(user.Phone, config.sms.regionAllowed[1]);
                            phoneValid = phoneUtil.isValidNumberForRegion(phoneNumber, config.sms.regionAllowed[1]);

                            if (phoneValid) {
                                logger.log('debug',"valid LI number");
                                region = config.sms.regionAllowed[1];
                            } else {
                                logger.log('debug',"invalid LI number");
                            }
                        }

                        const walletValid = WAValidator.validate(user.WalletId, 'litecoin', config.networkType);



                        let carrierValid = true;
                        let formattedPhone;
                        if (phoneValid) {
                            // format phone number for later easier comparison
                            const phoneNumber = phoneUtil.parseAndKeepRawInput(user.Phone, region);

                            if (phoneUtil.getNumberType(phoneNumber) != PNT.MOBILE) {
                                logger.log('debug',"not a mobile swiss number");
                                phoneValid = false;
                            }

                            // Check Carrier
                            if (phoneValid) {
                                formattedPhone = phoneUtil.format(phoneNumber, E164);
                                if (!
                                        (
                                            // Swiss Carrier https://github.com/googlei18n/libphonenumber/blob/master/resources/carrier/en/41.txt
                                            formattedPhone.startsWith("+4176") ||
                                            formattedPhone.startsWith("+4177") ||
                                            formattedPhone.startsWith("+4178") ||
                                            formattedPhone.startsWith("+4179") ||

                                            // Liechstenstein https://github.com/googlei18n/libphonenumber/blob/master/resources/carrier/en/423.txt
                                            formattedPhone.startsWith("+423650") ||
                                            formattedPhone.startsWith("+423651") ||
                                            formattedPhone.startsWith("+423652") ||
                                            formattedPhone.startsWith("+423660") ||
                                            formattedPhone.startsWith("+423661") ||
                                            formattedPhone.startsWith("+4236620") ||
                                            formattedPhone.startsWith("+4236626") ||

                                            formattedPhone.startsWith("+4236627") ||
                                            formattedPhone.startsWith("+4236628") ||
                                            formattedPhone.startsWith("+4236629") ||
                                            formattedPhone.startsWith("+4236639") ||
                                            formattedPhone.startsWith("+42373") ||
                                            formattedPhone.startsWith("+42374") ||
                                            formattedPhone.startsWith("+42377") ||
                                            formattedPhone.startsWith("+42378") ||
                                            formattedPhone.startsWith("+42379")
                                       )) {
                                    carrierValid = false;
                                    phoneValid = false;
                                    logger.log('debug','carrier is not swiss nor from liechtenstein');
                                }
                            }
                        }

                        if (emailValid && phoneValid && walletValid && carrierValid) {
                            user.Status = 'Valid';
                            user.Phone = formattedPhone;
                        } else {
                            if (!phoneValid && emailValid) {
                                const subject = translations.__('errors.phone.subject');
                                sendEmail.sendEmail(user, 'error-phone.pug', subject).then((success) => {
                                    if (success) {
                                        user.Status = 'PhoneErrorEmailSent';
                                        user.EmailSentDate = new Date();

                                        user.save().then(() => {
                                            resolve();
                                        }).catch(err => {
                                            logger.log('error', err);
                                            reject(err);
                                        });
                                    } else {
                                        reject();
                                    }
                                }).catch(err => {
                                    logger.log('error', err);
                                    reject(err);
                                });
                            }

                            if (!walletValid && emailValid) {
                                const subject = translations.__('errors.wallet.subject');
                                sendEmail.sendEmail(user, 'error-wallet.pug', subject).then((success) => {
                                    if (success) {
                                        user.Status = 'WalletErrorEmailSent';
                                        user.EmailSentDate = new Date();

                                        user.save().then(() => {
                                            resolve();
                                        }).catch(err => {
                                            logger.log('error', err);
                                            reject(err);
                                        });
                                    } else {
                                        reject();
                                    }
                                }).catch(err => {
                                    logger.log('error', err);
                                    reject(err);
                                });
                            }
                        }

                        user.save().then(() => {
                            resolve(true);
                        }).catch(err => {
                            logger.log('error', err);
                            reject(err);
                        });
                    });
                }
            }).catch(err => {
                logger.log('error', err);
                reject(err);
            });
        });
    }
}

module.exports = qualityProcess;
