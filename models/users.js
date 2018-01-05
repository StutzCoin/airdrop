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
        EMailValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        EmailSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        EmailSentDate: DataTypes.DATE,
        EmailKey: DataTypes.STRING,
        EmailKeyValidTo: DataTypes.STRING,
        EmailValidated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // Wallet
        WalletId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        WalletIdValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // Phone, SMS
        Phone: DataTypes.STRING,
        PhoneValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        SmsKey: DataTypes.STRING,
        SmsKeyValidTo: DataTypes.STRING,
        SmsSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        SmsSentDate: DataTypes.DATE,
        PhoneValidated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // Audit
        ImportedDate: DataTypes.DATE,

        // Status
        IsNew: {  // at import time
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });

    // audit tables
    new Version(Users);

    return Users;
};
