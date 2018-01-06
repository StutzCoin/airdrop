const i18n = require('i18n');

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.js')[env];

function translations() {
    var translations = {};
    i18n.configure({
        locales: config.locales,
        directory: __dirname + '/../../locales',
        autoReload: true,
        logDebugFn: function (msg) {
            logger.log('debug', msg);
        },
        logErrorFn: function (msg) {
            logger.log('error', msg);
        },
        register: translations,
        syncFiles: true,
        objectNotation: true
    });

    return translations;
}

module.exports = translations;
