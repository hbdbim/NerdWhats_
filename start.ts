import Logger from './helper/logger';
import Server from './server';
import Venom from './venom';

(async () => {
    Venom.start();
    await Server.start();
})();

// listen on SIGINT signal and gracefully stop the server
process.on('SIGINT', () => {
    Logger.info('Stopping hapi server');

    Server.stop().then(err => {
        Logger.error(`Server stopped`, err);
        process.exit(err ? 1 : 0);
    });
});

process.on('unhandledRejection', (reason, p) => {
    Logger.error(`Unhandled Rejection at Promise`, reason);
});

process.on('uncaughtException', err => {
    Logger.error(`Uncaught Exception thrown`, err);
});
