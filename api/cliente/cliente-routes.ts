import * as Hapi from '@hapi/hapi';
import ClienteController from './cliente-controller';
import Logger from '../../helper/logger';
import IRoute from '../../helper/route';
import validate from './cliente-validate';
//import * as Joi from '@hapi/joi';

export default class ClienteRoutes implements IRoute {
    public async register(server: Hapi.Server): Promise<any> {
        return new Promise(resolve => {
            Logger.info('UserRoutes - Start adding user routes');

            // Passing ID by constructor it's not neccesary as default value it's 'id'
            const controller = new ClienteController();

            server.route([
                {
                    method: 'GET',
                    path: '/api/cliente',
                    options: {
                        handler: controller.getAll,
                        description: 'Lista todos os clientes cadastrados.',
                        tags: ['api', 'cliente'],
                        auth: { scope: 'admin' }
                    },
                }, {
                    method: 'POST',
                    path: '/api/cliente',
                    options: {
                        handler: controller.create,
                        validate: validate.create,
                        pre: [{
                            assign: 'base64',
                            method: async function (request, h) {
                                let pay = request.payload as any;
                                let valor = `${pay._id}:${pay.senha}`;
                                const authHeader = `Basic ${Buffer.from(valor).toString('base64')}`;
                                pay.token = authHeader;

                                return h.continue;
                            }
                        }],
                        description: 'Grava um novo cliente.',
                        tags: ['api', 'cliente'],
                        auth: false
                    }
                }, {
                    method: 'PUT',
                    path: `/api/cliente/{${controller.id}}`,
                    options: {
                        handler: controller.updateById,
                        validate: validate.updateById,
                        pre: [{
                            assign: 'base64',
                            method: async function (request, h) {
                                let pay = request.payload as any;
                                let valor = `${request.params.id}:${pay.senha}`;
                                const authHeader = `Basic ${Buffer.from(valor).toString('base64')}`;
                                pay.token = authHeader;

                                return h.continue;
                            }
                        }],
                        description: 'Atualiza os dados do cliente',
                        tags: ['api', 'cliente'],
                        auth: false
                    },
                }, {
                    method: 'DELETE',
                    path: `/api/cliente/{${controller.id}}`,
                    options: {
                        handler: controller.deleteById,
                        validate: validate.deleteById,
                        description: 'Deleta o cliente pelo id',
                        tags: ['api', 'cliente'],
                        auth: {
                            scope: 'admin'
                        }
                    },
                }
               
            ]);

            Logger.info('UserRoutes - Finish adding user routes');

            resolve();
        });
    }
}
