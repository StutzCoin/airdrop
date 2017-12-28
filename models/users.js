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
        EMail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        WalletId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Phone: DataTypes.STRING,

        // SMS
        SmsKey: DataTypes.STRING,
        SmsKeyValidTo: DataTypes.STRING,
        SmsSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        SmsSentDate: DataTypes.DATE,

        // Audit
        ImportedDate: DataTypes.DATE,
        EmailSentDate: DataTypes.DATE,

        // Status
        IsNew: {  // at import time
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        EMailOK: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        PhoneOK: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        WalletIdOK: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        EmailSent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

    });

    return Users;
};
