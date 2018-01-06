#!/usr/bin/env node
const Logger = require('../src/modules/logger');
const logger = new Logger();

var models = require('../models/index');

// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function () {
    logger.log('info', 'database initialized');
});
