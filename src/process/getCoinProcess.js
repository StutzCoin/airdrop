#!/usr/bin/env node

const models = require('../../models/index');

const Logger = require('../modules/logger');
const logger = new Logger();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

/**
 * Purpose is to go through data and select only user.State = 'Completed' avoiding
 *  - duplicate phone entries
 *  - TODO number that are not of right carrier (cost $ to check)
 */
function getCoinProcess() {

    async function processItems(items) {
        return items.reduce((promise, item) => {
            return promise.then(() => applyUser(item));
        }, Promise.resolve());
    }

    async function phoneUsed(phone) {
        return new Promise(function (resolve, reject) {
            models.Coins.findAll({
                where: {
                    Phone: phone,
                },
            }).then(coins => {
                logger.log('info', 'Found ' + coins.length + ' coins to process.');
                resolve(coins.length == 1);
            }).catch(err => {
                logger.log('error', err);
                reject(err);
            });
        });
    }

    function applyUser(user) {
        return new Promise(function (resolve, reject) {

            phoneUsed(user.Phone).then((phoneUsed) => {
                if (!phoneUsed) {
                    logger.log('info', 'Phone ' + user.Phone + ' not used yet.');

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
                        user.Status = 'GetCoin';
                        logger.log('info', 'coins saved for phone=' + user.Phone + ' and user ' + user.FirstName);

                        user.save().then(() => {
                            logger.log('info', 'save new user user.Status=' + user.Status);
                            resolve(true);
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
                    user.Status = 'Refused';

                    user.save().then(() => {
                        logger.log('info', 'save new user user.Status=' + user.Status);
                        resolve(true);
                    }).catch(err => {
                        logger.log('error', err);
                        reject(err);
                    });
                }
            });
        });
    }

    this.getCoin = async function getCoin() {
        const users = await models.Users.findAll({
            where: {
                Status: 'Completed',
            },
            limit: config.readLimit
        });

        logger.log('info', 'Found ' + users.length + ' users to process.');
        await processItems(users);
    }
}

module.exports = getCoinProcess;
