const should = require('should');
const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');

import {email} from '../../src/process/emailProcess';

const models = require('../../models/index');

import {saveUsers, truncateUsers, getFirstUser} from '../helpers/user';

import {expect} from 'chai';

describe('Process: emailProcess', () => {

    before(done => {
        // Enable mockery to mock objects
        mockery.enable({
            warnOnUnregistered: false,
        });

        /* Once mocked, any code that calls require('nodemailer')
        will get our nodemailerMock */
        mockery.registerMock('nodemailer', nodemailerMock)

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

    it('Should set SMS field properly after SMS sent', async function () {
        saveUsers([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: '',
            LastName: '',
            WalletId: '',
            Phone: '+41790000000',
            // require by process
            EMailValid: true,
            EmailSent: false,
            PhoneValid: true,
        }]);

        // Act
        await email();

        // Assert
        let user = await getFirstUser();

        expect(user).to.not.be.null;
        expect(Number(user.EmailKey)).to.satisfy(Number.isInteger);
        expect(user.EmailValidTo).to.not.be.null;

        // get the array of emails we sent
        const sentMail = nodemailerMock.mock.sentMail();
        // we should have sent one email
        sentMail.length.should.be.exactly(1);

        expect(user.EmailSentDate).to.not.be.null;
        expect(user.EmailSent).to.be.equal(true);
    });
});
