#!/usr/bin/env node

const models = require('../../models/index');
import logger from '../modules/logger';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

export async function sendEmail() {
    logger.log('info', 'Send email to users');

    const users = models.Users.findAll({
        where: {
            EMailOK: true,
            EmailSent: false,
        },
        limit: config.readLimit
    });

    logger.log('info', 'Found ' + users.length + ' users to process.');
    users.forEach(user => {
        // TODO implement
    });
}
