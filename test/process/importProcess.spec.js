const should = require('should');

const mockery = require('mockery');
const nodemailerMock = require('nodemailer-mock');

const models = require('../../models/index');

import {saveUsers, truncateUsers, getFirstUser} from '../helpers/user';

import {expect} from 'chai';

const chai = require('chai');
const chaiHttp = require('chai-http');

const fs = require('fs');

chai.use(chaiHttp);

// under test
const server = require('../../src/process/importProcess.js');

describe('Process: importProcess', () => {

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

    it('userRegistered webhook', done => {
        // Arrange
        const form_response = JSON.parse(fs.readFileSync('test/fixtures/userRegistered.json', 'utf8'));

        // Act
        chai.request(server)
            .post('/userRegistered')
            .send(form_response)
            .end((err, res) => {
                res.should.have.status(200);

                //TODO extend assert

            });

        done();
    });

    it('validateEmail webhook', async () => {
        // Arrange
        await saveUsers([{
            FirstName: 'Jane',
            EMail: '',
            LastName: '',
            WalletId: '',
            Phone: '+41790000000',

            // require by process
            IsNew: false,
            EMailKey: '1234567',  // match test/fixtures/validateEmail.json
            EmailSent: true,
        }]);

        const form_response = JSON.parse(fs.readFileSync('test/fixtures/validateEmail.json', 'utf8'));

        // Act
        chai.request(server)
            .post('/validateEmail')
            .send(form_response)
            .end((err, res) => {
                res.should.have.status(200);

                //TODO extend assert

            });
    });

    it('validatePhone webhook', async () => {
        // Arrange
        await saveUsers([{
            FirstName: 'Jane',
            EMail: '',
            LastName: '',
            WalletId: '',
            Phone: '+41790000000',

            // require by process
            IsNew: false,
            SmsKey: '1234567',  // match test/fixtures/validatePhone.json
            SmsSent: true,
        }]);

        const form_response = JSON.parse(fs.readFileSync('test/fixtures/validatePhone.json', 'utf8'));

        // Act
        chai.request(server)
            .post('/validatePhone')
            .send(form_response)
            .end((err, res) => {
                res.should.have.status(200);

                //TODO extend assert

            });
    });

});
