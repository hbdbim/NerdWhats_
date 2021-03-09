import { ClienteModel } from "./model/cliente-model";
import { WhatsCliente } from "./core/WhatsCliente";
import ClienteResolver from "./api/cliente/cliente-resolver";
import Logger from './helper/logger';

export default class Venom {
    private static _instance: WhatsCliente[] = [];

    public static start() {
        var resolver = new ClienteResolver();
        resolver.getAll().then((data: ClienteModel[]) => {
            data.forEach((c: ClienteModel) => {
                var cli = new ClienteModel(c._id, c.domain, c.webhook);                
                if (cli.autoload)
                    try {
                        Logger.info(`WhatsCLiente - Registering cliente ${cli._id}`);
                        var service = new WhatsCliente(cli);
                        service.resolver = resolver;
                        this._instance.push(service);
                        service.create();
                    } catch (e) {
                        Logger.error(`Erro on register cliente ${cli._id}`, e);
                    }
            });
        });
    }

    public static getCliente = async (
        _id: string): Promise<WhatsCliente> => {
        var ret = Venom._instance.filter(w => w.model._id == _id)[0];
        if (!ret) {
            let resolver = new ClienteResolver();
            let cliente = await resolver.getOneById(_id);
            if (cliente) {
                ret = new WhatsCliente(cliente);
                Venom._instance.push(ret);
            }
        }
        return ret;
    }
}