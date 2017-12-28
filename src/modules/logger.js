'use strict';

const winston = require('winston');
const moment = require('moment');
const util = require('util');

function getLogger() {

    winston.setLevels({
        info: 1,
        warning: 2,
        error: 3,
        audit: 4
    });

    winston.addColors({
        info: 'blue',
        error: 'red',
        warning: 'yellow',
        audit: 'green'
    });

    const logger = new (winston.Logger)({
        levels: {
            audit: 0,
            info: 1,
            warning: 2,
            error: 3
        },
        transports: [
            new (winston.transports.Console)({
                    colorize: true,
                }
            ),
            new (winston.transports.File)({
                timestamp() {
                    return moment().format('YYYY-MM-DD HH:mm:ss.SSSS');
                },
                formatter(params) {
                    // Options object will be passed to the format function.
                    // It's general properties are: timestamp, level, message, meta.
                    const meta = params.meta !== undefined ? util.inspect(params.meta, {depth: null}) : '';
                    return `[${params.timestamp()}] [${params.level}] *** ${params.message} `;
                },
                name: 'infoLogger',
                filename: './logs/log.log',
                prettyPrint: false,
                level: 'info',
                silent: false,
                colorize: false,
                showLevel: true,
                maxsize: 40000,
                maxFiles: 10,
                json: false,
                tailable: true
            }),
        ],
        colors: {
            info: 'blue',
            error: 'red',
            warning: 'yellow',
            audit: 'green'
        }
    });

    return logger;
}

const logger = getLogger();

export default logger;
