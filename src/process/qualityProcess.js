#!/usr/bin/env node

const models = require('../../models/index');
const validator = require("email-validator");

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

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

                        const phoneNumber = phoneUtil.parse(user.Phone, config.sms.regionAllowed);

                        const phoneValid = phoneUtil.isValidNumberForRegion(phoneNumber, config.sms.regionAllowed);

                        const walletValid = WAValidator.validate(user.WalletId, 'litecoin', config.networkType);

                        if (!emailValid) {
                            user.Status = 'EmailError';
                        }

                        if (emailValid && phoneValid && walletValid) {
                            user.Status = 'Valid';

                            // format phone number for later easier comparison
                            const phoneNumber = phoneUtil.parseAndKeepRawInput(user.Phone, config.sms.regionAllowed);
                            user.Phone = phoneUtil.format(phoneNumber, E164);
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
