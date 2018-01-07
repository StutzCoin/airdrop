const should = require('should');
const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');

const EmailProcess = require('../../src/process/emailProcess');
const emailProcess = new EmailProcess();

const models = require('../../models/index');

import {saveUsers, truncateUsers, getFirstUser} from '../helpers/user';

import {expect} from 'chai';

const chai = require("chai");
chai.use(require('chai-uuid'));

describe('Process: emailProcess', () => {

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

    it('Should send proper email in english and set database field', async () => {
        // Arrange
        await saveUsers([{

            FirstName: 'Jane',
            EMail: '',
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: '+41790000000',
            // require by process
            Status: 'Valid',
        }]);

        // Act
        await emailProcess.email();

        // Assert
        let user = await getFirstUser();
        expect(user).to.not.be.null;

        // database
        expect(user.EmailKey).to.be.a.uuid('v5');
        expect(user.EmailValidTo).to.not.be.null;
        expect(user.EmailSentDate).to.not.be.null;
        expect(user.Status).to.be.equal('EmailSent');

        // get the array of emails we sent
        const sentMail = nodemailerMock.mock.sentMail();
        // we should have sent one email
        sentMail.length.should.be.exactly(1);

        const Sent = sentMail[0];
        expect(Sent.from).to.be.equal('stutzbot@gmail.com');
        expect(Sent.subject).to.be.equal('Stutz email validation code (valid 15 min)');
        expect(await Sent.text).to.be.equal('<!DOCTYPE html><html lang="en"><head><title>Stutz Coin - Swissness coin</title><meta charset="utf-8"></head><body><img class="className" id="IdName" src="https://raw.githubusercontent.com/StutzCoin/airdrop/master/templates/img/logo.png" alt="Stutz logo"><p>Hi, welcome to the Stutz Airdrop!</p><h1>Thanks for registering for Stutz Airdrop</h1><p>Dear Jane </p><p>Your email validation code is 5f0d1374-6df3-5217-9ecc-33dd90ba0828 valid up to 473040000 please enter code <a href="https://cdricwalter.typeform.com/to/mLte7Q?key=5f0d1374-6df3-5217-9ecc-33dd90ba0828&amp;firstname=Jane&amp;lastname=">Here</a> to complete airdrop registration.\n'+
            '</p><p><a href="https://twitter.com/STUTZcoin">Twitter</a> - <a href="https://www.facebook.com/STUTZ-379426659150116">Facebook</a> - <a href="https://t.me/STUTZcoin">Telegram</a></p></body></html>');
    });

    it('Should send proper email in french and set database field', async () => {
        // Arrange
        await saveUsers([{
            FirstName: 'Jane',
            EMail: '',
            Locale: 'fr',
            LastName: '',
            WalletId: '',
            Phone: '+41790000000',
            // require by process
            Status: 'Valid',
        }]);

        // Act
        await emailProcess.email();

        // Assert
        let user = await getFirstUser();
        expect(user).to.not.be.null;

        // database
        expect(user.EmailKey).to.be.a.uuid('v5');
        expect(user.EmailValidTo).to.not.be.null;
        expect(user.EmailSentDate).to.not.be.null;
        expect(user.Status).to.be.equal('EmailSent');

        // get the array of emails we sent
        const sentMail = nodemailerMock.mock.sentMail();
        // we should have sent one email
        sentMail.length.should.be.exactly(1);

        const Sent = sentMail[0];
        expect(Sent.from).to.be.equal('stutzbot@gmail.com');
        expect(Sent.subject).to.be.equal('Votre code de validation est valable 15 minutes');
        expect(await Sent.text).to.be.equal('<!DOCTYPE html><html lang="en"><head><title>Stutz Coin - Swissness coin</title><meta charset="utf-8"></head><body><img class="className" id="IdName" src="https://raw.githubusercontent.com/StutzCoin/airdrop/master/templates/img/logo.png" alt="Stutz logo"><p>Hi, welcome to the Stutz Airdrop!</p><h1>Mercide votre interët pour Stutz</h1><p>Chèr(e) Jane </p><p>Your email validation code is 5f0d1374-6df3-5217-9ecc-33dd90ba0828 valid up to 473040000 please enter code <a href="https://cdricwalter.typeform.com/to/mLte7Q?key=5f0d1374-6df3-5217-9ecc-33dd90ba0828&amp;firstname=Jane&amp;lastname=">Here</a> to complete airdrop registration.\n' +
            '</p><p><a href="https://twitter.com/STUTZcoin">Twitter</a> - <a href="https://www.facebook.com/STUTZ-379426659150116">Facebook</a> - <a href="https://t.me/STUTZcoin">Telegram</a></p></body></html>');
    });
});
