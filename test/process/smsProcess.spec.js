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

    it('Should set SMS field properly after SMS sent', async () => {
        await saveUsers([{
            IsNew: true,
            FirstName: 'Jane',
            EMail: '',
            LastName: '',
            WalletId: '',
            Phone: '+41790000000',

            // require by process
            EmailValidated: true,
            PhoneValid: true,
        }]);

        // Act
        await sms(true);

        // Assert
        let user = await getFirstUser();
        expect(user.SmsKey).to.be.a.uuid('v5');

        expect(user.SmsKeyValidTo).to.not.be.null;
        expect(user.SmsSentDate).to.not.be.null;
        expect(user.SmsSent).to.be.equal(true);
    });
});
