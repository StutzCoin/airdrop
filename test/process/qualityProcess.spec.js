const should = require('should');
const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');

import {check} from '../../src/process/qualityProcess';

const QualityProcess = require('../../src/process/qualityProcess');
const qualityProcess = new QualityProcess();

const models = require('../../models/index');

import {saveUsers, truncateUsers} from '../helpers/user';

import {expect} from 'chai';

const LTC_TESTNET = 'LVg2kJoFNg45Nbpy53h7Fe1wKyeXVRhMH9';
const LTC_MAINNET = 'mzBc4XEFSdzCDcTxAgf6EZXgsZWpztRhef';

const VALID_SWISS_NUMBER = '+41791234567';
const PROPERLY_FORMATTED_SWISS_NUMBER = '+41791234567';
const INVALID_SWISS_NUMBER = '+33389000000';
const INVALID_SWISS_NUMBER2 = '0389000000';


async function checkUserAndReturn(usersToSave) {
    await saveUsers(usersToSave);

    // Act
    await qualityProcess.check();

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
    if (locale === 'en') {
        expect(Sent.subject).to.be.equal('Your phone is not valid');
        expect(await Sent.text).to.be.equal('<!DOCTYPE html><html lang="en"><head><title>Your phone is not valid</title><meta charset="utf-8"></head><body><p>Either your phone number is invalid or not a swiss valid number. Please submit again your data.</p><p><a href="https://twitter.com/STUTZcoin">Twitter</a> - <a href="https://www.facebook.com/STUTZ-379426659150116">Facebook</a> - <a href="https://t.me/STUTZcoin">Telegram</a></p></body></html>');
    }
    if (locale === 'fr') {
        expect(Sent.subject).to.be.equal('Your phone is not valid');
        expect(await Sent.text).to.be.equal('<!DOCTYPE html><html lang="en"><head><title>Vitre numero de telephone n\'est pas valide.</title><meta charset="utf-8"></head><body><p>Either your phone number is invalid or not a swiss valid number. Please submit again your data.</p><p><a href="https://twitter.com/STUTZcoin">Twitter</a> - <a href="https://www.facebook.com/STUTZ-379426659150116">Facebook</a> - <a href="https://t.me/STUTZcoin">Telegram</a></p></body></html>');
    }
}

async function assertWalletInvalidEmail(locale = 'en') {
// get the array of emails we sent
    const sentMail = nodemailerMock.mock.sentMail();
    // we should have sent one email
    sentMail.length.should.be.exactly(1);

    const Sent = sentMail[0];
    expect(Sent.from).to.be.equal('stutzbot@gmail.com');
    if (locale === 'en') {
        expect(Sent.subject).to.be.equal('Your wallet is not valid');
        expect(await Sent.text).to.be.equal('<!DOCTYPE html><html lang="en"><head><title>Your wallet is not valid</title><meta charset="utf-8"></head><body><p>Your wallet is not valid, please provide a new one. Please submit again your data.</p><p><a href="https://twitter.com/STUTZcoin">Twitter</a> - <a href="https://www.facebook.com/STUTZ-379426659150116">Facebook</a> - <a href="https://t.me/STUTZcoin">Telegram</a></p></body></html>');
    }
    if (locale === 'fr') {
        expect(Sent.subject).to.be.equal('Votre adresse wallet n\'est pas valide');
        expect(await Sent.text).to.be.equal('<!DOCTYPE html><html lang="en"><head><title>Votre adresse wallet n\'est pas valide</title><meta charset="utf-8"></head><body><p>Votre adresse wallet n\'est pas valide, please provide a new one. Please submit again your data.</p><p><a href="https://twitter.com/STUTZcoin">Twitter</a> - <a href="https://www.facebook.com/STUTZ-379426659150116">Facebook</a> - <a href="https://t.me/STUTZcoin">Telegram</a></p></body></html>');
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

    it('Should set Status=EmailError for invalid empty email field', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: '',
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: INVALID_SWISS_NUMBER
        }]);

        expect(user.Status).to.be.equal('EmailError');
    });

    it('Should set Status=EmailError for invalid email field', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any',
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: INVALID_SWISS_NUMBER
        }]);

        expect(user.Status).to.be.equal('EmailError');
    });

    it('Should set Status=Valid for valid email field', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: VALID_SWISS_NUMBER
        }]);

        expect(user.Status).to.be.equal('Valid');
    });

    it('Should set Status=Valid for valid testnet wallet id', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: VALID_SWISS_NUMBER
        }]);

        expect(user.Status).to.be.equal('Valid');
    });

    it('Should set Status=WalletErrorEmailSent for testnet wallet id', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_TESTNET,
            Phone: VALID_SWISS_NUMBER
        }]);

        expect(user.Status).to.be.equal('WalletErrorEmailSent');

        await assertWalletInvalidEmail();
    });

    it('Should set Status=WalletErrorEmailSent for empty  wallet id', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: VALID_SWISS_NUMBER
        }]);

        expect(user.Status).to.be.equal('WalletErrorEmailSent');

        await assertWalletInvalidEmail();
    });

    it('Should set Status=WalletErrorEmailSent and french text for empty wallet id', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'fr',
            LastName: '',
            WalletId: '',
            Phone: VALID_SWISS_NUMBER
        }]);

        expect(user.Status).to.be.equal('WalletErrorEmailSent');

        await assertWalletInvalidEmail('fr');
    });

    it('Should set Status=PhoneErrorEmailSent for non-CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: INVALID_SWISS_NUMBER
        }]);

        // Assert
        expect(user.Status).to.be.equal('PhoneErrorEmailSent');

        await assertPhoneInvalidEmail();
    });

    it('Should set Status=PhoneErrorEmailSent for non-CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: INVALID_SWISS_NUMBER2
        }]);

        // Assert
        expect(user.Status).to.be.equal('PhoneErrorEmailSent');

        await assertPhoneInvalidEmail();
    });

    it('Should set Status=PhoneErrorEmailSent for ' + INVALID_SWISS_NUMBER + 'non-CH swiss number', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'fr',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: INVALID_SWISS_NUMBER
        }]);

        // Assert
        expect(user.Status).to.be.equal('PhoneErrorEmailSent');

        await assertPhoneInvalidEmail('fr');
    });

    it('Should set Status=Valid for +41791234567 swiss number', async () => {
        let PROPERLY_FORMATTED_SWISS_NUMBER = '+41791234567';
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: PROPERLY_FORMATTED_SWISS_NUMBER
        }]);

        expect(user.Status).to.be.equal('Valid');
        expect(user.Phone).to.be.equal(PROPERLY_FORMATTED_SWISS_NUMBER);
    });

    it('Should set Status=Valid for 0791234567 swiss number', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: '0791234567'
        }]);

        expect(user.Status).to.be.equal('Valid');
        expect(user.Phone).to.be.equal(PROPERLY_FORMATTED_SWISS_NUMBER);
    });

    it('Should set Status=Valid for 791234567 swiss number', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: '791234567'
        }]);

        expect(user.Status).to.be.equal('Valid');
        expect(user.Phone).to.be.equal(PROPERLY_FORMATTED_SWISS_NUMBER);
    });

    it('Should set Status=PhoneErrorEmailSent for fix line swiss number', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: '044 980 31 11'
        }]);

        expect(user.Status).to.be.equal('PhoneErrorEmailSent');
    });

    it('Should set Status=PhoneErrorEmailSent for fix line liechtenstein number', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: '+423 2377400'
        }]);

        expect(user.Status).to.be.equal('PhoneErrorEmailSent');
    });

    it('Should set Status=PhoneErrorEmailSent for mobile liechtenstein number', async () => {
        let user = await checkUserAndReturn([{
            Status: 'IsNew',
            FirstName: 'Jane',
            EMail: 'any@acme.com',
            Locale: 'en',
            LastName: '',
            WalletId: LTC_MAINNET,
            Phone: '+42378 12345'  // Salt LI
        }]);

        expect(user.Status).to.be.equal('Valid');
    });

});
