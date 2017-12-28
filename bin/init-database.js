#!/usr/bin/env node

var models = require('../models/index');

// sync() will create all table if they doesn't exist in database
models.sequelize.sync().then(function() {

});
