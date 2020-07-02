//import * as Hapi from '@hapi/hapi';
//import * as Boom from '@hapi/boom';
//import Logger from "../../helper/logger"
import CrudController from '../../common/crud-controller';
import { ClienteModel } from "../../model/cliente-model";
import ClienteResolver from './cliente-resolver';

export default class ClienteController extends CrudController<ClienteModel> {
    constructor(id?: string) {
        super(id, new ClienteResolver());
    }
}