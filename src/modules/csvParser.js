'use strict';

const fs = require('fs');
const csv = require('csv');
var models = require('../../models');
import logger from './logger';

export async function parseCSV(file) {
    logger.log('info', 'importing from csv')
    const Users = models.Users;

    var parser = csv.parse({delimiter: ';'}, function (err, data) {
        // TODO Mapping
        const FirstName = data['FirstName'];
        const LastName = data['LastName'];

        let userModel = Users.build({FirstName: FirstName, LastName: LastName});
        userModel.save()
    });

    var readStream = fs.createReadStream(file).pipe(parser);

    readStream.on('error', function (err) {
        console.log(err);
    });
}
