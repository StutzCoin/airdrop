#!/usr/bin/env node

import logger from '../modules/logger';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

export async function renderEmailContent(user, template) {
    try {
        // require absolute path, don't remove __dirname
        const html = await pug.renderFile(__dirname + '/../../templates/' + template, pug.runtime.merge({
            filename: template,
            compileDebug: false,
            pretty: true,
            // variables used in template
            firstName: user.FirstName,
            lastName: user.LastName,
            emailKey: user.EmailKey,
            email: user.Email,
            emailKeyValidTo: user.EmailKeyValidTo,
            emailValidationUrl: config.email.formUrl + '?key=' + user.EmailKey + '&firstname=' + user.FirstName + '&lastname=' + user.LastName//use type-form hidden fields
        }));

        return html;
    }
    catch (err) {
        logger.log('error', 'while rendering email \'' + template + '\' html template for user ' + user.Name)
    }
}

export async function sendEmail(user, templateName, subject) {
    return new Promise(function (resolve, reject) {
        // TODO translations see https://www.npmjs.com/package/gulp-i18n-pug
        const content = renderEmailContent(user, templateName);

        const mailOptions = {
            from: config.email.from,
            to: user.EMail,
            subject: subject,
            text: content
        };

        const nodemailer = require('nodemailer');
        //  TODO only support gmail for now
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email.user,
                pass: config.email.password
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
