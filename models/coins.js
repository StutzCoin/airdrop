'use strict';
const Version = require('sequelize-version');

module.exports = (sequelize, DataTypes) => {
    var Coins = sequelize.define('Coins', {
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
        Locale: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        WalletId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Phone: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    // audit tables
    new Version(Coins);

    return Coins;
};
