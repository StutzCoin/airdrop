#!/usr/bin/env node
'use strict';

const Sequelize = require("sequelize");

const Op = Sequelize.Op;

const models = require('../models/index');

// Note that the first arg is usually the path to nodejs, and the second arg is the location of the script you're executing.
var args = process.argv.slice(2);

models.Users.getVersions(
    {
        where: {
            [Op.and]: [
                {FirstName: args[0]},
                {LastName: args[1]},
            ]
        },
    }
).then((versions) => {
    console.log(JSON.parse(JSON.stringify(versions)));
});

