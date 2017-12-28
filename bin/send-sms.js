#!/usr/bin/env node
import {importAll} from '../src/process/sendEmailProcess';
import logger from '../src/modules/logger';

sendEMail().then((count) => {
        logger.log('info', 'send sms process successful: ' + count);
        // TODO implement SMS process
    },
    (err) => {
        logger.log('error', 'send sms process  failed: ' + err);
    };
);
