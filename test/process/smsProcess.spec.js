import {sms} from '../../src/process/smsProcess';

const models = require('../../models/index');

import {saveUsers, truncateUsers, getFirstUser} from '../helpers/user';

import {expect} from 'chai';

const chai = require("chai");
chai.use(require('chai-uuid'));

describe('Process: smsProcess', () => {

    before( done => {
        models.sequelize.sync().then(function() {
            done();
        });
    });

    afterEach(done => {
        truncateUsers();
        done();
    });

    it('Should send proper SMS in english', async () => {
        await saveUsers([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: '',
            Locale: 'en',
            LastName: '',
            WalletId: '',
            Phone: '+41790000000',

            // require by process
            EmailValidated: true,
            PhoneValid: true,
        }]);

        // Act
        const content = await sms(true);

        // Assert
        let user = await getFirstUser();
        expect(user.SmsKey).to.be.a.uuid('v5');

        expect(user.SmsKeyValidTo).to.not.be.null;
        expect(user.SmsSentDate).to.not.be.null;
        expect(user.SmsSent).to.be.equal(true);
        expect(content).to.be.equal('Your Stutz Code is 5f0d1374-6df3-5217-9ecc-33dd90ba0828 valid up to 473040000 please visit url: https://cdricwalter.typeform.com/to/RNvI6l?key=5f0d1374-6df3-5217-9ecc-33dd90ba0828&firstname=Jane&lastname= to complete airdrop registration.');
    });

    it('Should send proper SMS in french', async () => {
        await saveUsers([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: '',
            Locale: 'fr',
            LastName: '',
            WalletId: '',
            Phone: '+41790000000',

            // require by process
            EmailValidated: true,
            PhoneValid: true,
        }]);

        // Act
        const content = await sms(true);

        // Assert
        let user = await getFirstUser();
        expect(user.SmsKey).to.be.a.uuid('v5');

        expect(user.SmsKeyValidTo).to.not.be.null;
        expect(user.SmsSentDate).to.not.be.null;
        expect(user.SmsSent).to.be.equal(true);
        expect(content).to.be.equal('Votre Stutz Code is 5f0d1374-6df3-5217-9ecc-33dd90ba0828 valid up to 473040000 please visit url: https://cdricwalter.typeform.com/to/RNvI6l?key=5f0d1374-6df3-5217-9ecc-33dd90ba0828&firstname=Jane&lastname= to complete airdrop registration.');
    });



});
