import {expect} from 'chai';

import {renderEmailContent} from '../../src/modules/sendEmail';

import {saveUsers, truncateUsers, getFirstUser} from '../helpers/user';

describe('renderEmailContent', () => {

    afterEach(done => {
        truncateUsers();

        done();
    });

    it('should render email content properly', async () => {
        // Prepare
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
        let user = await getFirstUser();

        // Act
        const html = await renderEmailContent(user, 'validate-email.pug');

        // Assert
        expect(html).to.not.be.null;
    });

});
