import {check} from '../../src/process/qualityProcess';

const models = require('../../models/index');

import {saveUsers, truncateUsers} from '../helpers/user';

import {expect} from 'chai';

async function checkUserAndReturn(userWithValidTestNetWallet) {
    await saveUsers(userWithValidTestNetWallet);

    // Act
    await check();

    // Assert
    const users = await models.Users.findAll({
        where: {FirstName: 'Jane'}
    });
    expect(users.length, 1);

    return users[0];
}

describe('Process: qualityProcess', () => {

    afterEach(done => {
        truncateUsers();
        done();
    });

    it('Should set EMailOK=false for invalid empty email field', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: '',
            LastName: '',
            WalletId: '',
        }]);

        expect(user.EMailOK).to.be.equal(false);
    });

    it('Should set EMailOK=false for invalid email field', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any',
            LastName: '',
            WalletId: '',
        }]);

        expect(user.EMailOK).to.be.equal(false);
    });

    it('Should set EMailOK=false for valid email field', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: '',
        }]);

        expect(user.EMailOK).to.be.equal(true);
    });

    it('Should set WalletIdOK=true for valid testnet wallet id', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: 'mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef',
        }]);

        expect(user.WalletIdOK).to.be.equal(true);
    });

    it('Should set WalletIdOK=false for valid mainnet wallet id', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: 'LVg2kJoFNg45Nbpy53h7Fe1wKyeXVRhMH9',
        }]);

        expect(user.WalletIdOK).to.be.equal(false);
    });

    it('Should set WalletIdOK=false for empty  wallet id', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: '',
        }]);

        expect(user.WalletIdOK).to.be.equal(false);
    });

});
