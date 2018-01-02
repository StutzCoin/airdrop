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

export async function getFirstUser(firstName) {
    firstName = firstName || 'Jane';
    const users = await models.Users.findAll({
        where: {FirstName: firstName}
    });
    expect(users.length, 1);

    let user = users[0];
    return user;
}

