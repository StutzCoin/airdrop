#!/usr/bin/env node
const SmsProcess = require('../src/process/smsProcess');
const smsProcess = new SmsProcess();

smsProcess.sms();
