const models = require('../../models/index');

import {expect} from 'chai';

const usersTable = models.Users;

export async function saveUsers(users) {
    return new Promise((resolve, reject) => {

        var fn = investor => {
            const model = usersTable.build(investor);
            model.save();
            return true;
        };

        Promise.all(users.map(fn)).then(result => {
            resolve(true);
        }).catch(err => {
            reject(err);
        });
    });
}

export async function truncateUsers() {
    await usersTable.destroy({truncate: true});
}


