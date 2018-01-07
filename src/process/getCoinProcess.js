#!/usr/bin/env node

const models = require('../../models/index');

const Logger = require('../modules/logger');
const logger = new Logger();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

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
                        // TODO sanitize database after airdrop and decide user getting coin -> uniqueness testing
                });
            }).catch(err => {
                logger.log('error', err);
                reject(err);
            });
        });
    }
}

module.exports = getCoinProcess;
