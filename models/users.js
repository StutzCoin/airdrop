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

        // Audit
        ImportedDate: DataTypes.DATE,
        SmsSentDate: DataTypes.DATE,
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

        SmsSent: {
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
