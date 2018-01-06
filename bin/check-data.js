#!/usr/bin/env node
const QualityProcess = require('../../src/process/qualityProcess');
const qualityProcess = new QualityProcess();

qualityProcess.check();
