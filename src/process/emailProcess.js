#!/usr/bin/env node

const models = require('../../models/index');

const Logger = require('../modules/logger');
const logger = new Logger();

import {duration} from '../modules/time';
import {sendEmail} from '../../src/modules/sendEmail';

const Translations = require('../../src/modules/i18n');
const translations = new Translations();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const uuidv5 = require('uuid/v5');
const i18n = require('i18n');

export async function email() {
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
                let expire = new Date() + duration.minutes(config.email.expireInMinutes);
                if (env === 'development') {
                    expire = duration.years(config.email.expireInMinutes);
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

                sendEmail(user, 'validate-email.pug', subject).then( (success)  => {
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
