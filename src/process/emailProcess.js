#!/usr/bin/env node

const models = require('../../models/index');

import logger from '../modules/logger';
import {duration} from '../modules/time';
import {sendEmail} from '../../src/modules/sendEmail';


const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const uuidv5 = require('uuid/v5');

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
                user.EmailKey = uuidv5(config.coin.home, uuidv5.URL);
                user.EmailKeyValidTo = new Date() + duration.minutes(config.email.expireInMinutes);

                const subject = 'Stutz email validation code (valid 15 min)';
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
