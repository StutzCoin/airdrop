'use strict';
const Version = require('sequelize-version');

module.exports = (sequelize, DataTypes) => {
    var Users = sequelize.define('Users', {
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // EMail
        EMail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        EmailSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        EmailSentDate: DataTypes.DATE,
        EmailKey: DataTypes.STRING,
        EmailKeyValidTo: DataTypes.STRING,
        Locale: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // Wallet
        WalletId: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        // Phone, SMS
        Phone: DataTypes.STRING,
        SmsKey: DataTypes.STRING,
        SmsKeyValidTo: DataTypes.STRING,
        SmsSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        SmsSentDate: DataTypes.DATE,

        // Audit
        ImportedDate: DataTypes.DATE,

        // Status
        Status: {
            type: DataTypes.ENUM,
            values: [
                'None',
                'IsNew', // at import time

                // emailProcess
                'EmailSent',
                'EmailValidated',

                // smsProcess
                'SmsSent',
                'PhoneValidated',

                'Completed',

                // qualityProcess
                'Valid',
                'EmailError',
                'WalletErrorEmailSent',
                'PhoneErrorEmailSent',

                // getCoinProcess
                'GetCoin',
                'Refused',
            ],
            defaultValue: 'None',
        },


    });

    // audit tables
    new Version(Users);

    return Users;
};
