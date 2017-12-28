'use strict';

import logger from "./logger";

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const twilio = require('twilio');
const client = new twilio(config.twilio.accountSid, config.twilio.authToken);

/**
 *  send SMS using Twilio.com
 * @param to
 * @param content
 * @returns {Promise<void>}
 */
export async function sendSMS(to, content) {
    await client.messages.create({
        body: content,
        to: to,
        from: config.twilio.number
    })
        .then((message) => logger.log('audit', 'message sent to ' + to +' ' + message.sid));
}
