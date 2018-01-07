#!/usr/bin/env node

const models = require('../../models/index');

const Logger = require('../modules/logger');
const logger = new Logger();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];


/**
 * Purpose is to go through data and select only user.State = 'Completed' avoiding
 *  - duplicate entries
 *  - TODO number that are not of right carrier (cost $ to check)
 */
function getCoinProcess() {

    this.getCoin = async function getCoin() {
        return new Promise(function (resolve, reject) {
            models.Users.findAll({
                where: {
                    Status: 'Completed',
                },
                limit: config.readLimit
            }).then(users => {
                logger.log('info', 'Found ' + users.length + ' users to process.');
                users.forEach(user => {
                    models.Coins.findAll({
                        where: {
                            Phone: user.Phone,
                        },
                    }).then(coins => {
                        logger.log('info', 'Found ' + coins.length + ' coins to process.');
                        if (coins.length == 0) {
                            logger.log('info', 'Phone ' + user.Phone + ' not used yet.');
                            user.State = 'GetCoin';

                            const coin = models.Coins.build({
                                FirstName: user.FirstName,
                                LastName: user.LastName,
                                EMail: user.EMail,
                                Locale: user.Locale,
                                WalletId: user.WalletId,
                                Phone: user.Phone,
                            });

                            // this user will get coins
                            coin.save().then(() => {
                                // do nothing
                                logger.log('info', 'coins saved for phone=' + user.Phone + ' and user ' + user.FirstName);

                                // save new User.State
                                user.save().then(() => {
                                    logger.log('info', 'save new user user.State=' + user.State);
                                    resolve();
                                }).catch(err => {
                                    logger.log('error', err);
                                    reject(err);
                                });

                            }).catch(err => {
                                logger.log('error', err);
                                reject(err);
                            });
                        } else {
                            logger.log('info', 'Phone ' + user.Phone + ' already used.');
                            user.State = 'Refused';

                            // save new User.State
                            user.save().then(() => {
                                logger.log('info', 'save new user user.State=' + user.State);
                                resolve();
                            }).catch(err => {
                                logger.log('error', err);
                                reject(err);
                            });
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

module.exports = getCoinProcess;
