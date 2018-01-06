const should = require('should');
const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');

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

async function assertPhoneInvalidEmail(locale = 'en') {
// get the array of emails we sent
    const sentMail = nodemailerMock.mock.sentMail();
    // we should have sent one email
    sentMail.length.should.be.exactly(1);

    const Sent = sentMail[0];
    expect(Sent.from).to.be.equal('stutzbot@gmail.com');
    expect(Sent.subject).to.be.equal('Your phone is not valid');
    if (locale === 'en') {
        expect(await Sent.text).to.be.equal('<!DOCTYPE html><html lang="en"><head><title>Your phone is not valid</title><meta charset="utf-8"></head><body><p>Either your phone number is invalid or not a swiss valid number. Please submit again your data.</p><p><a href="https://twitter.com/STUTZcoin">Twitter</a> - <a href="https://www.facebook.com/STUTZ-379426659150116">Facebook</a> - <a href="https://t.me/STUTZcoin">Telegram</a></p></body></html>');
    }
    if (locale === 'fr') {
        expect(await Sent.text).to.be.equal('<!DOCTYPE html><html lang="en"><head><title>Vitre numero de telephone n\'est pas valide.</title><meta charset="utf-8"></head><body><p>Either your phone number is invalid or not a swiss valid number. Please submit again your data.</p><p><a href="https://twitter.com/STUTZcoin">Twitter</a> - <a href="https://www.facebook.com/STUTZ-379426659150116">Facebook</a> - <a href="https://t.me/STUTZcoin">Telegram</a></p></body></html>');
    }

}

describe('Process: qualityProcess', () => {

    before(done => {
        // Enable mockery to mock objects
        mockery.enable({
            warnOnUnregistered: false,
        });

        /* Once mocked, any code that calls require('nodemailer')
        will get our nodemailerMock */
        mockery.registerMock('nodemailer', nodemailerMock);

        models.sequelize.sync().then(function () {
            done();
        });
    });

    afterEach(done => {
        truncateUsers();

        // Reset the mock back to the defaults after each test
        nodemailerMock.mock.reset();

        done();
    });

    after(function () {
        // Remove our mocked nodemailer and disable mockery
        mockery.deregisterAll();
        mockery.disable();
    });

    it('Should set EMailValid=false for invalid empty email field', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: '',
            Locale: 'en',
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
            Locale: 'en',
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
            Locale: 'en',
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
            Locale: 'en',
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
            Locale: 'en',
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
            Locale: 'en',
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
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: '+33389000000'
        }]);

        // Assert
        expect(user.PhoneValid).to.be.equal(false);

        await assertPhoneInvalidEmail();
    });

    it('Should set PhoneValid=false for non-CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: '0389000000'
        }]);

        expect(user.PhoneValid).to.be.equal(false);

        await assertPhoneInvalidEmail();
    });

    it('Should set PhoneValid=false for non-CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'fr',
            LastName: '',
            WalletId: '',
            Phone: '+33389000000'
        }]);

        // Assert
        expect(user.PhoneValid).to.be.equal(false);

        await assertPhoneInvalidEmail('fr');
    });

    it('Should set PhoneValid=true for CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
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
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: '0791234567'
        }]);

        expect(user.PhoneValid).to.be.equal(true);
    });

    it('Should set PhoneValid=true for CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: '791234567'
        }]);

        expect(user.PhoneValid).to.be.equal(true);
    });
});
