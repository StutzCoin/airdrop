const GetCoinProcess = require('../../src/process/getCoinProcess');
const getCoinProcess = new GetCoinProcess();

const models = require('../../models/index');

import {saveUsers, truncateUsers, getFirstUser} from '../helpers/user';
import {saveCoins, truncateCoins, getFirstCoin} from '../helpers/coins';

import {expect} from 'chai';

describe('Process: getCoinProcess', () => {

    before(done => {
        models.sequelize.sync().then(function () {
            done();
        });
    });

    afterEach(done => {
        truncateUsers();
        truncateCoins();
        done();
    });

    it('mutltiple user sharing same phone number, only one will get coins', async () => {
        // Arrange
        const anyPhoneNumber = '1234';

        await saveUsers([
            {
                FirstName: 'Jane',
                LastName: 'Doe',
                EMail: '',
                Locale: 'en',
                WalletId: '',
                Phone: anyPhoneNumber,
                // require by process
                Status: 'Completed',
            },
            {
                FirstName: 'Dark',
                LastName: 'Vador',
                EMail: '',
                Locale: 'en',
                WalletId: '',
                Phone: anyPhoneNumber,
                // require by process
                Status: 'Completed',
            },
        ]);

        // Act
        await getCoinProcess.getCoin();

        // Assert
        let jane = await getFirstUser('Jane');
        expect(await jane.Status).to.be.equal('GetCoin');
        expect(await getFirstCoin('Jane')).to.not.be.null;

        // Dark get flagged & won't get coins
        let darkVador = await getFirstUser('Dark');
        expect(darkVador.Status).to.be.equal('Refused');
        expect(await getFirstCoin('Dark')).to.be.an('undefined');
    });

});
