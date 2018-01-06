#!/usr/bin/env node

const models = require('../../models/index');

const Logger = require('../modules/logger');
const logger = new Logger();

const SendEmail = require('../../src/modules/sendEmail');
const sendEmail = new SendEmail();

const Translations = require('../../src/modules/i18n');
const translations = new Translations();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const uuidv5 = require('uuid/v5');
const i18n = require('i18n');

function emailProcess() {

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

    this.email = async function email() {
        return new Promise(function (resolve, reject) {
            models.Users.findAll({
                where: {
                    EMailValid: true,
                    EmailSent: false,
                },
                limit: config.readLimit
            }).then(users => {
                logger.log('info', 'Found ' + users.length + ' users to process.');
                users.forEach(user => {
                    translations.setLocale(user.Locale);

                    user.EmailKey = uuidv5(config.coin.home, uuidv5.URL);

                    // TODO bad only for unit test
                    let expire = new Date() + minutes(config.email.expireInMinutes);
                    if (env === 'development') {
                        expire = years(config.email.expireInMinutes);
                    }

                    user.EmailKeyValidTo = expire;

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

                    const subject = translations.__('validate-email.subject');

                    sendEmail.sendEmail(user, 'validate-email.pug', subject).then((success) => {
                        if (success) {
                            user.EmailSent = true;
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
                });
            }).catch(err => {
                logger.log('error', err);
                reject(err);
            });
        });
    }
}

module.exports = emailProcess;
