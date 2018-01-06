#!/usr/bin/env node
const EmailProcess = require('../src/process/emailProcess');
const emailProcess = new EmailProcess();

emailProcess.email();
