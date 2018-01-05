#!/usr/bin/env node

import logger from '../modules/logger';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const pug = require('pug');

export async function renderEmailContent(user, template) {
    // require absolute path, don't remove __dirname
    const html = await pug.renderFile(__dirname + '/../../templates/' + template,
        {
            // variables used in template
            firstName: user.FirstName,
            lastName: user.LastName,
            emailKey: user.EmailKey,
            email: user.Email,
            emailKeyValidTo: user.EmailKeyValidTo,
            emailValidationUrl: config.email.formUrl + '?key=' + user.EmailKey + '&firstname=' + user.FirstName + '&lastname=' + user.LastName//use type-form hidden fields
        }
    );

    return html;
};


export async function sendEmail(user, templateName, subject) {
    const content = await renderEmailContent(user, templateName);

    return new Promise(function (resolve, reject) {
        // TODO translations see https://www.npmjs.com/package/gulp-i18n-pug
        const mailOptions = {
            from: config.email.from,
            to: user.EMail,
            subject: subject,
            text: content
        };

        const nodeMailer = require('nodemailer');
        const transporter = nodeMailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: config.email.secure, // true for 465, false for other ports
            auth: {
                user: config.email.auth.user,
                pass: config.email.auth.pass
            }
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.log('error', error);
                reject(false);
            } else {
                console.log('audit', 'Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
}
