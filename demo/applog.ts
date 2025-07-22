import log4js from 'log4js';

// Configure log4js
log4js.configure({
    appenders: {
        out: { type: 'stdout' }, // Console output
        app: { type: 'file', filename: 'log/application.log' } // File output
    },
    categories: {
        default: { appenders: ['out', 'app'], level: 'debug' }
    }
});

export const logger = log4js.getLogger();