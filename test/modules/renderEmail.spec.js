import {expect} from 'chai';

import {renderEmail} from '../../src/modules/sendEmail';


describe('RenderEmail', () => {

    it('should render email content properly', async () => {
        // Prepare
        // Act
        const html = await renderEmail();

        // Assert
        expect(html).to.not.be.null;
    });

});
