'use strict';

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

const pug = require('pug');
import logger from './logger';

export async function sendSMS(to, content) {
 // TODO implement

 // using gateway or linux gammu package

}
