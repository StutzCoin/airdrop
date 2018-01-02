#!/usr/bin/env node

const models = require('../../models/index');
import logger from '../modules/logger';
import {duration} from '../modules/time';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const min = 10000;
const max = 99999;

//TODO replace with UUID to avoid brute force? number should be unique to update right user
function getRandomNumber() {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function renderEmailContent(user, template) {
    try {
        // require absolute path, don't remove __dirname
        const html = await pug.renderFile(__dirname + '/../../templates/' + template, pug.runtime.merge({
            filename: template,
            compileDebug: false,
            pretty: true,
            firstName: user.FirstName,
            lastName: user.LastName,
            EmailKey: user.EmailKey,
            EmailKeyValidTo: user.EmailKeyValidTo,
            EmailValidationUrl: user.checkCodeUrl
        }));

        return html;
    }
    catch (err) {
        logger.log('error', 'while rendering email \'' + template + '\' html template for user ' + user.Name)
    }
}

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

                // TODO translations see https://www.npmjs.com/package/gulp-i18n-pug
                const content = renderEmailContent(user, 'email.pug');
                const subject = 'Stutz email validation code (valid 15 min)';

                user.EmailKey = getRandomNumber();
                user.EmailKeyValidTo = new Date() + duration.minutes(config.email.expireInMinutes);

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
                    } else {
                        console.log('audit', 'Email sent: ' + info.response);

                        user.EmailSent = true;
                        user.EmailSentDate = new Date();
                        user.save().then(() => {
                            resolve(true);
                        });
                    }
                });
            });
        }).catch(err => {
            logger.log('error', err);
            reject(err);
        });
    });
}
