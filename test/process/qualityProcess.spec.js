import {check} from '../../src/process/qualityProcess';

const models = require('../../models/index');

import {saveUsers, truncateUsers} from '../helpers/user';

import {expect} from 'chai';

async function checkUserAndReturn(usersToSave) {
    await saveUsers(usersToSave);

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

    before( done => {
        models.sequelize.sync().then(function() {
            done();
        });
    });

    afterEach(done => {
        truncateUsers();
        done();
    });

    it('Should set EMailValid=false for invalid empty email field', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: '',
            LastName: '',
            WalletId: '',
            Phone: '+33389000000'
        }]);

        expect(user.EMailValid).to.be.equal(false);
    });

    it('Should set EMailValid=false for invalid email field', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any',
            LastName: '',
            WalletId: '',
            Phone: '+33389000000'
        }]);

        expect(user.EMailValid).to.be.equal(false);
    });

    it('Should set EMailValid=false for valid email field', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: '',
            Phone: '+33389000000'
        }]);

        expect(user.EMailValid).to.be.equal(true);
    });

    it('Should set WalletIdValid=true for valid testnet wallet id', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: 'mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef',
            Phone: '+33389000000'
        }]);

        expect(user.WalletIdValid).to.be.equal(true);
    });

    it('Should set WalletIdValid=false for valid mainnet wallet id', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: 'LVg2kJoFNg45Nbpy53h7Fe1wKyeXVRhMH9',
            Phone: '+33389000000'
        }]);

        expect(user.WalletIdValid).to.be.equal(false);
    });

    it('Should set WalletIdValid=false for empty  wallet id', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: '',
            Phone: '+33389000000'
        }]);

        expect(user.WalletIdValid).to.be.equal(false);
    });

    it('Should set PhoneValid=false for non-CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: '',
            Phone: '+33389000000'
        }]);

        expect(user.PhoneValid).to.be.equal(false);
    });

    it('Should set PhoneValid=true for CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: '',
            Phone: '+41791234567'
        }]);

        expect(user.PhoneValid).to.be.equal(true);
    });

    it('Should set PhoneValid=true for CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            LastName: '',
            WalletId: '',
            Phone: '0791234567'
        }]);

        expect(user.PhoneValid).to.be.equal(true);
    });
});
