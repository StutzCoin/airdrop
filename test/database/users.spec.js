const models = require('../../models/index');

import {expect} from 'chai';

import {saveUsers, truncateUsers} from '../helpers/user';

describe('Database: Users', () => {
    const UsersTable = models.Users;

    before( done => {
        models.sequelize.sync().then(function() {
            done();
        });
    });

    beforeEach( async () => {
        await saveUsers([{
            FirstName: 'jane',
            LastName: 'doe',
            WalletId: "0x0000000",
            EMail: 'any@acme.com',
            IsNew: false,
            Mail: 'any@host.com',
            Locale: 'en',
        }]);
    });

    afterEach(() => {
        truncateUsers();
    });

    it('should return the Users', () => {
        expect(models.Users).to.not.be.null;
    });

    it('should be able to connect to database', () => {
        models.sequelize
            .authenticate()
            .then(() => {
                expect(true);
            })
            .catch(err => {
                expect.fail('Unable to connect to the database:', err);
            });
    });

    it('Add data via instance.save, retrieve via model.count and model.find', done => {
        // Act
        UsersTable.findAll({
            where: {
                FirstName: 'jane',
            }
        }).then(user => {
            // Assert
            expect(user).to.not.be.null;
            expect(user.length, 1);

            expect(user[0].FirstName).to.be.equal('jane');

            return UsersTable.count();
        }).then(count => {
            // Assert
            expect(count).to.not.be.null;
            expect(count).to.equal(1);

            done();
        });
    });

});
