import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import IRoute from '../../helper/route';
import WhatsController from './whtas-controller';
import Joi = require('@hapi/joi');

export default class WhatsRoutes implements IRoute {
    public async register(server: Hapi.Server): Promise<any> {
        return new Promise(resolve => {
            Logger.info('UserRoutes - Start adding whtas routes');

            const controller = new WhatsController();
            const rootUrl = '/whats/';

            server.route([
                {
                    method: 'GET',
                    path: `${rootUrl}status`,
                    options: {
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.AssingCliente }],
                        handler: controller.status,
                        description: 'Retorna status do cliente logado.',
                        tags: ['api', 'whats']
                    }
                },
                {
                    method: 'GET',
                    path: `${rootUrl}start`,
                    options: {
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.AssingCliente }],
                        handler: controller.start,
                        description: 'Inicializa sesssão do whats cliente.',
                        tags: ['api', 'whats']
                    }
                },
                {
                    method: 'GET',
                    path: `${rootUrl}close`,
                    options: {
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.AssingCliente }],
                        handler: controller.close,
                        description: 'Finaliza sesssão£o do whats clietne.',
                        tags: ['api', 'whats']
                    }
                },
                {
                    method: 'GET',
                    path: `${rootUrl}restart`,
                    options: {
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.AssingCliente }],
                        handler: controller.restart,
                        description: 'Reinicializa sesssão do whats clietne.',
                        tags: ['api', 'whats']
                    }
                }, {
                    method: 'GET',
                    path: `${rootUrl}getAllNewMessages`,
                    options: {
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.PreConected }],
                        handler: controller.getAllNewMessages,
                        description: 'Busca todas as mensagens.',
                        tags: ['api', 'whats']
                    }
                }, {
                    method: 'GET',
                    path: `${rootUrl}getAllUnreadMessages`,
                    options: {
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.PreConected }],
                        handler: controller.getAllUnreadMessages,
                        description: 'Busca todas as mensagens não lidas.',
                        tags: ['api', 'whats']
                    }
                }, {
                    method: 'GET',
                    path: `${rootUrl}getNumberProfile/{id}`,
                    options: {
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.PreConected }],
                        validate: { params: Joi.object({ id: Joi.string().required() }) },
                        handler: controller.getNumberProfile,
                        description: 'Verfica se o numero é valido e ativo no whats.',
                        tags: ['api', 'whats']
                    }
                }, {
                    method: 'POST',
                    path: `${rootUrl}sendText`,
                    options: {
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.PreConected }],
                        validate: { payload: Joi.object({ to: Joi.string().required(), content: Joi.string().required() }) },
                        handler: controller.sendText,
                        description: 'Envia mensagem de texto.',
                        tags: ['api', 'whats']
                    }
                },
                {
                    method: 'POST',
                    path: `${rootUrl}sendFileFromBase64`,
                    options: {
                        plugins: {
                            'hapi-swagger': {
                                payloadType: 'form'
                            }
                        },
                        pre: [{ assign: 'session', method: controller.AssingSession }, { assign: 'client', method: controller.PreConected }],
                        validate: {
                            payload: Joi.object(
                                {
                                    to: Joi.string().required(),
                                    content: Joi.string().required(),
                                    file: Joi.any()
                                        .meta({ swaggerType: 'file' })
                                        .description('json file')

                                })
                        },
                        payload: {
                            maxBytes: 1048576,
                            parse: true,
                            output: 'stream',
                            allow: 'multipart/form-data',
                            multipart: { output: 'stream' }
                        },
                        handler: controller.sendFileFromBase64,
                        description: 'Envia mensagem de texto.',
                        tags: ['api', 'whats']
                    }
                }
                //GRAVA UM NOVO CLIENTE
                //{
                //    payload: 
                //}
                //{
                //    method: 'POST',
                //    path: '/cliente',
                //    handler: (request, reply) => {
                //        let cliente: ClienteModel = new ClienteModel(request.payload.id, request.payload.domain, null);
                //        globalThis.dataBase.addCliente(cliente);
                //        return cliente;
                //    }
                //},
                //{
                //    method: 'GET',
                //    path: '/status/{id}',
                //    handler: (request, reply) => {
                //        let controller = new WhatsController();
                //        var cliente = controller.getCliente(request.params.id);
                //        if (cliente != undefined)
                //            return cliente.parse();
                //        return reply.response('Cliente não cadastrado').code(404);
                //    }
                //},
                //{
                //    method: 'GET',
                //    path: '/getAllNewMessages/{id}',
                //    handler: (request, reply) => {
                //        let controller = new WhatsController();
                //        return controller.getAllNewMessages(request.params.id);
                //    }
                //},
                //{
                //    method: 'GET',
                //    path: '/getAllUnreadMessages/{id}',
                //    handler: (request, reply) => {
                //        let controller = new WhatsController();
                //        return controller.getAllUnreadMessages(request.params.id);
                //    }
                //},
                //{
                //    method: 'GET',
                //    path: '/getAllChats/{id}',
                //    handler: (request, reply) => {
                //        let controller = new WhatsController();
                //        return controller.getAllChats(request.params.id);
                //    }
                //},
                //{
                //    method: 'GET',
                //    path: '/getNumberProfile/{id}',
                //    handler: (request, reply) => {
                //        let controller = new WhatsController();
                //        return controller.getNumberProfile(request.params.id, request.query.contactId);
                //    }
                //},
                //{
                //    method: 'POST',
                //    path: '/sendText/{id}',
                //    handler: async (request, h) => {
                //        let controller = new WhatsController();
                //        const ret = await controller.sendText(request.params.id, request.payload.to, request.payload.content);
                //        if (!ret)
                //            return false
                //        return ret;
                //    }
                //},
                //{
                //    method: 'POST',
                //    path: '/sendAllUnreadMessages/{id}',
                //    handler: (request, reply) => {
                //        let controller = new WhatsController();
                //        return controller.sendAllUnreadMessages(request.params.id);
                //    }
                //}
            ]);

            Logger.info('UserRoutes - Finish adding whtas routes');

            resolve();
        });
    }
}
