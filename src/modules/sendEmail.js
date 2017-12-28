'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const nodeMailer = require('nodemailer');

const pug = require('pug');
import logger from './logger';

/**
 * render a PUG templates.
 *
 * @param templateName
 * @returns {Promise<any>}
 */
export async function renderEmail(templateName) {
    const template = templateName || 'email.pug';
    return new Promise(function (resolve, reject) {
        logger.log('info', 'renderEmail module started');
        try {
            // require absolute path, don't remove __dirname
            const html = pug.renderFile(__dirname + '/../../templates/' + template, pug.runtime.merge({
                filename: template,
                compileDebug: false,
                pretty: true
            }));

            resolve(html);
        }
        catch (err) {
            logger.log('error', 'while rendering email \'' + template + '\' html template for ')
            reject(err);
        }
    });
};


export async function sendEmail(to, html) {
    logger.log('info', 'sendEmail module started');

    // create reusable transporter object using the default SMTP transport
    const transporter = nodeMailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure, // true for 465, false for other ports
        auth: {
            user: config.smtp.auth.user,
            pass: config.smtp.auth.pass
        }
    });

    const message = {
        from: config.smtp.from,
        to: to,
        subject: to,
        text: ' ',
        html: html
    };

    try {
        // send mail with defined transport object
        await transporter.sendMail(message);
    } catch (err) {
        logger.log('error', err);
        throw err;
    }
    finally {
        transporter.close();
    }
}
