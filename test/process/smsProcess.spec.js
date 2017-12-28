import {sms} from '../../src/process/smsProcess';

const models = require('../../models/index');

import {saveUsers, truncateUsers} from '../helpers/user';

import {expect} from 'chai';

async function getFirstUser() {
    const users = await models.Users.findAll({
        where: {FirstName: 'Jane'}
    });
    expect(users.length, 1);

    let user = users[0];
    return user;
}

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
            EMailOK: true,
            EmailSent: true,
            PhoneOK: true,
        }]);

        // Act
        await sms(true);

        // Assert
        let user = await getFirstUser();
        expect(Number(user.SmsKey)).to.satisfy(Number.isInteger);
        expect(user.SmsKeyValidTo).to.not.be.null;
        expect(user.SmsSentDate).to.not.be.null;
        expect(user.SmsSent).to.be.equal(true);
    });
});
