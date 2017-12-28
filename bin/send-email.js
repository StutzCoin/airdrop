#!/usr/bin/env node
import {importAll} from '../src/process/sendEmailProcess';
import logger from '../src/modules/logger';

sendEMail().then((count) => {
        logger.log('info', 'send email process successful: ' + count);
        // TODO implement EMail process
    },
    (err) => {
        logger.log('error', 'send email process  failed: ' + err);
    };
);
