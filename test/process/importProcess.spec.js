const models = require('../../models/index');

import {saveUsers, truncateUsers, getFirstUser} from '../helpers/user';

import {expect} from 'chai';


describe('Process: importProcess', () => {

    before(done => {
        models.sequelize.sync().then(function () {
            done();
        });
    });

    afterEach(done => {
        truncateUsers();

        done();
    });

    it('userRegistered webhook', async function () {
        // TODO
    });

    it('validateEmail webhook', async function () {
        // TODO
    });

    it('validatePhone webhook', async function () {
        // TODO
    });


});
