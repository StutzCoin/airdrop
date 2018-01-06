#!/usr/bin/env node
const Logger = require('../src/modules/logger');
const logger = new Logger();

const EmailProcess = require('../src/process/emailProcess');
const emailProcess = new EmailProcess();

emailProcess.email();
