'use strict';
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
        EMailOK: {
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

        // Wallet
        WalletId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        WalletIdOK: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        // Phone, SMS
        Phone: DataTypes.STRING,
        PhoneOK: {
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

        // Audit
        ImportedDate: DataTypes.DATE,

        // Status
        IsNew: {  // at import time
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    });

    return Users;
};
