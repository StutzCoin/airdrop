const models = require('../../models/index');

import {expect} from 'chai';

const CoinsTable = models.Coins;

export async function saveCoins(Coins) {
    return new Promise((resolve, reject) => {

        var fn = coin => {
            const model = CoinsTable.build(coin);
            model.save();
            return true;
        };

        Promise.all(Coins.map(fn)).then(result => {
            resolve(true);
        }).catch(err => {
            reject(err);
        });
    });
}

export async function truncateCoins() {
    await CoinsTable.destroy({truncate: true});
}

export async function getFirstCoin(firstName) {
    const Coins = await models.Coins.findAll({
        where: {FirstName: firstName}
    });
    expect(Coins.length, 1);

    let coin = Coins[0];
    return coin;
}

