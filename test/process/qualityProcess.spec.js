import {check} from '../../src/process/qualityProcess';

const models = require('../../models/index');

import {saveUsers, truncateUsers} from '../helpers/user';

import {expect} from 'chai';
import logger from "../../src/modules/logger";

async function saveInvestorAssertState(state, investors) {




    if (investorsModel.length > 1) {
        expect(investorsModel[1].State).to.be.equal(state);
    }
}

describe('Process: qualityCheckProcess', () => {

    afterEach(done => {
        truncateUsers();
        done();
    });

    it('Should set EMailOK=false for invalid empty email field', async () => {
        const userUnderTest = [{
            IsNew: true,
            FirstName: 'Jane',
            EMail: '',
            LastName: '',
            WalletId: '',
        }];
        await saveUsers(userUnderTest);

        // Act
        await check();

        // Assert
        const users = await models.Users.findAll({
            where: {FirstName: 'Jane'}
        });
        expect(users.length, 1);
        expect(users[0].EMailOK).to.be.equal(false);
    });

    it('Should set EMailOK=false for invalid email field', async () => {
        const userUnderTest = [{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any',
            LastName: '',
            WalletId: '',
        }];
        await saveUsers(userUnderTest);

        // Act
        await check();

        // Assert
        const users = await models.Users.findAll({
            where: {FirstName: 'Jane'}
        });
        expect(users.length, 1);
        expect(users[0].EMailOK).to.be.equal(false);
    });

    it('Should set EMailOK=false for valid email field', async () => {
        const userWithValidEmail = [{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: '',
        }];
        await saveUsers(userWithValidEmail);

        // Act
        await check();

        // Assert
        const users = await models.Users.findAll({
            where: {FirstName: 'Jane'}
        });
        expect(users.length, 1);
        expect(users[0].EMailOK).to.be.equal(true);
    });

});
