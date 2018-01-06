'use strict';

const Logger = require('../modules/logger');
const logger = new Logger();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const twilio = require('twilio');
const client = new twilio(config.sms.accountSid, config.sms.authToken);


function sendSMS() {
    /**
     *  send SMS using Twilio.com
     * @param to
     * @param content
     * @returns {Promise<void>}
     */
    this.sendSMS =  async function sendSMS(to, content) {
        return new Promise(function (resolve, reject) {
            client.messages.create({
                body: content,
                to: to,
                from: config.sms.number
            }).then((message) => {
                logger.log('audit', 'message sent to ' + to + ' ' + message.sid)
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = sendSMS;
