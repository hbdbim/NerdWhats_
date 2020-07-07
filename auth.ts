import * as Hapi from '@hapi/hapi';
import Logger from './helper/logger';
import ClienteResolver from "./api/cliente/cliente-resolver";
const BasicAuth = require('@hapi/basic');

export default class Auth {
    public static async Init(server) {

        // register the @hapi/basic plugin on our own otherwise
        // the unit tests will fail because the module name '@hapi/basic'
        // doesn't match the plugin name 'basic'.
        return Auth.register(server, [{ plugin: BasicAuth, options: { once: true } }]).then(() => {
            try {
                server.auth.strategy('simple', 'basic', {
                    validate: async function (request, sessionId, key, h) {
                        Logger.debug('validacao de login: ' + JSON.stringify(request.headers.authorization));

                        if (process.env.SENHA == request.headers.authorization) {
                            const credentials = {
                                scope: 'admin'
                            };
                            return { credentials, isValid: true };
                        }

                        var resolver = new ClienteResolver();
                        var cliente = await resolver.getByToken(request.headers.authorization);

                        if (!cliente)
                            return { isValid: false };

                        const credentials = {
                            scope: 'cliente',
                            user: cliente
                        };

                        return { credentials, isValid: true };

                    }
                });

                server.auth.strategy('admin', 'basic', {
                    validate: async function (request, sessionId, key, h) {
                        Logger.debug('validacao de login: ' + JSON.stringify(request.headers.authorization));

                        if (process.env.SENHA == request.headers.authorization) {
                            return { isValid: true };
                        }

                        return { isValid: false };
                    }
                });

                server.auth.default('simple');
            } catch (error) {
                Logger.info(
                    `Plugins - Ups, something went wrong when registering swagger-ui plugin: ${error}`
                );
            }
        });

    };

    private static async register(
        server: Hapi.Server,
        plugin: any
    ): Promise<void> {
        Logger.debug('registering: ' + JSON.stringify(plugin));

        return new Promise((resolve, reject) => {
            server.register(plugin);
            resolve();
        });
    }
}