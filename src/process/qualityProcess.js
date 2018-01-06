#!/usr/bin/env node

const models = require('../../models/index');
const validator = require("email-validator");

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const WAValidator = require('wallet-address-validator');

import logger from '../modules/logger';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

import {sendEmail} from '../../src/modules/sendEmail';
import translations from '../../src/modules/i18n';

export async function check() {
    logger.log('info', 'Quality data check started');
    return new Promise(function (resolve, reject) {
        // Get all new person data
        models.Users.findAll({
            where: {
                IsNew: true,
            },
            limit: config.readLimit
        }).then(users => {
            if (users.length > 0) {
                users.forEach(user => {
                    translations.setLocale(user.Locale);

                    user.EMailValid = validator.validate(user.EMail);

                    const phone_number = phoneUtil.parse(user.Phone, "CH");

                    user.PhoneValid = phoneUtil.isValidNumberForRegion(phone_number, 'CH');

                    user.WalletIdValid = WAValidator.validate(user.WalletId, 'litecoin', config.networkType);

                    if (user.EMailValid && user.PhoneValid && user.WalletIdValid) {
                        user.IsNew = false;
                    } else {
                        if (!user.PhoneValid && user.EMailValid) {
                            const subject = translations.__('errors.phone.subject');
                            sendEmail(user, 'error-phone.pug', subject).then( (success)  => {
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
