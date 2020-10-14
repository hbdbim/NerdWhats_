import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import Logger from "../../helper/logger"
import newResponse from '../../helper/response';
import { ClienteModel } from "../../model/cliente-model";
import Venom from '../../venom';
import { ClienteState } from '../../model/enum-status';
import { WhatsCliente } from '../../core/WhatsCliente';
import * as FileType from 'file-type';
import { ClienteStatus } from '../../model/cliente-status';

export default class WhatsController {

    public AssingSession = async (request: Hapi.Request, toolkit: Hapi.ResponseToolkit): Promise<any> => {
        try {
            if (request.auth.isAuthenticated)
                return request.auth.credentials.user as ClienteModel;
            else {
                return toolkit.response(
                    newResponse(request, {
                        boom: Boom.unauthorized(),
                    })
                );
            }
        } catch (error) {
            return toolkit.response(
                newResponse(request, {
                    boom: Boom.badImplementation(error),
                })
            );
        }
    }

    public AssingCliente = async (request: Hapi.Request, toolkit: Hapi.ResponseToolkit): Promise<any> => {
        try {
            let session = request.pre.session as ClienteModel;
            let cliente = await Venom.getCliente(session._id);
            return cliente;
        } catch (error) {
            return toolkit.response(
                newResponse(request, {
                    boom: Boom.badImplementation(error),
                })
            );
        }

    }

    public PreConected = async (request: Hapi.Request, toolkit: Hapi.ResponseToolkit): Promise<any> => {
        try {
            let session = request.pre.session as ClienteModel;
            let cliente = await Venom.getCliente(session._id);
            if (cliente.model.status.status != ClienteState.CONECTADO) {
                var ret = toolkit.response(
                    newResponse(request, {
                        boom: Boom.preconditionRequired("cliente desconectado"),
                    })
                );
                ret.takeover();
                return ret;
            }
            return cliente;
        } catch (error) {
            return toolkit.response(
                newResponse(request, {
                    boom: Boom.badImplementation(error),
                })
            );
        }

    }

    public status = async (
        request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit
    ): Promise<any> => {
        try {
            Logger.info(`GET - ${request.url.href}`);

            let cliente = request.pre.client as WhatsCliente;

            if (!cliente)
                return toolkit.response(
                    newResponse(request, {
                        boom: Boom.notFound(),
                    })
                );

            if (cliente.model.status.status == null)
                cliente.create();

            return toolkit.response(
                newResponse(request, {
                    value: cliente.model.status,
                })
            );
        } catch (error) {
            return toolkit.response(
                newResponse(request, {
                    boom: Boom.badImplementation(error),
                })
            );
        }
    };

    public start = async (
        request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit
    ): Promise<any> => {
        try {
            Logger.info(`GET - ${request.url.href}`);

            let cliente = request.pre.client as WhatsCliente;

            cliente.create();

            return toolkit.response(
                newResponse(request, {
                    value: cliente.model.status,
                })
            );
        } catch (error) {
            return toolkit.response(
                newResponse(request, {
                    boom: Boom.badImplementation(error),
                })
            );
        }
    };

    public close = async (
        request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit
    ): Promise<any> => {
        try {
            Logger.info(`GET - ${request.url.href}`);

            let cliente = request.pre.client as WhatsCliente;
            cliente.close();

            return toolkit.response(
                newResponse(request, {
                    value: cliente.model.status,
                })
            );
        } catch (error) {
            return toolkit.response(
                newResponse(request, {
                    boom: Boom.badImplementation(error),
                })
            );
        }
    };

    public restart = async (request: Hapi.Request, toolkit: Hapi.ResponseToolkit): Promise<any> => {
        try {
            Logger.info(`GET - ${request.url.href}`);

            let cliente = request.pre.client as WhatsCliente;
            cliente.close();
            cliente.model = request.pre.session as ClienteModel;
            cliente.model.status = new ClienteStatus();
            cliente.create();

            return toolkit.response(
                newResponse(request, {
                    value: cliente.model.status,
                })
            );
        } catch (error) {
            return toolkit.response(
                newResponse(request, {
                    boom: Boom.badImplementation(error),
                })
            );
        }
    };

    public getAllNewMessages = async (
        request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit
    ): Promise<any> => {
        try {
            Logger.info(`GET - ${request.url.href}`);

            let cliente = request.pre.client as WhatsCliente;

            let data = await cliente.getAllNewMessages();

            return toolkit.response(
                newResponse(request, {
                    value: data,
                })
            );
        } catch (error) {
            return this.catch(error, request, toolkit);
        }
    };

    public getAllUnreadMessages = async (
        request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit
    ): Promise<any> => {
        try {
            Logger.info(`GET - ${request.url.href}`);

            let cliente = request.pre.client as WhatsCliente;

            let data = await cliente.getAllUnreadMessages();

            return toolkit.response(
                newResponse(request, {
                    value: data,
                })
            );
        } catch (error) {
            return this.catch(error, request, toolkit);
        }
    };

    public getNumberProfile = async (
        request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit
    ): Promise<any> => {
        try {
            Logger.info(`GET - ${request.url.href}`);

            let cliente = request.pre.client as WhatsCliente;
            const whatsId = (request.params as any).id;

            let data = await cliente.getNumberProfile(whatsId);

            return toolkit.response(
                newResponse(request, {
                    value: data,
                })
            );
        } catch (error) {
            return this.catch(error, request, toolkit);
        }
    };

    public sendText = async (
        request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit
    ): Promise<any> => {
        try {
            Logger.info(`POST - ${request.url.href}`);

            let cliente = request.pre.client as WhatsCliente;
            let payload = request.payload as any;

            let data = await cliente.sendText(payload.to, payload.content);

            return toolkit.response(
                newResponse(request, {
                    value: data,
                })
            );
        } catch (error) {
            return this.catch(error, request, toolkit);
        }
    };

    public sendFileFromBase64 = async (
        request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit
    ): Promise<any> => {
        try {
            Logger.info(`POST - ${request.url.href}`);

            let payload = request.payload as any;
            let cliente = request.pre.client as WhatsCliente;
            var base64 = payload.file._data.toString('base64');
            const fileType = await FileType.fromBuffer(payload.file._data);
            var mime = fileType.mime;
            const dataContent = `data:${mime};base64,${base64}`;

            let data = await cliente.sendFileFromBase64(payload.to, dataContent, payload.file.hapi.filename, payload.content);

            return toolkit.response(
                newResponse(request, {
                    value: data,
                })
            );
        } catch (error) {
            return this.catch(error, request, toolkit);
        }
    };

    private catch(error, request: Hapi.Request,
        toolkit: Hapi.ResponseToolkit) {

        Logger.error(`ERROR - ${request} - ${error}`);
        // se a sessão foi fechada tenta reiniciar o cliente whtas
        if (error.message && error.message.indexOf('Session closed') > -1) {
            let cliente = request.pre.client as WhatsCliente;
            cliente.close();
            cliente.model = request.pre.session as ClienteModel;
            cliente.model.status = new ClienteStatus();
            cliente.create();
        }
        return toolkit.response(
            newResponse(request, {
                boom: Boom.badImplementation(error),
            })
        );

    }
}