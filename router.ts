import * as Hapi from '@hapi/hapi';
import ClienteRoutes from './api/cliente/cliente-routes';
import Logger from './helper/logger';
import WhatsRoutes from './api/whats/whats-routes';

export default class Router {
    public static async loadRoutes(server: Hapi.Server): Promise<any> {
        Logger.info('Router - Start adding routes');

        server.route([{
            method: 'GET',
            path: '/ping',
            options: {
                auth: false,
                handler: async (
                    request: Hapi.Request,
                    toolkit: Hapi.ResponseToolkit
                ): Promise<any> => { return true; }
            }
        }]);
        await new ClienteRoutes().register(server);
        await new WhatsRoutes().register(server);

        Logger.info('Router - Finish adding routes');
    }
}
