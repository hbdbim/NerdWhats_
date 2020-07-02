import { ClienteStatus } from "./cliente-status";

export class ClienteModel {
    _id: string;
    senha: string;
    token: string;
    domain: string;
    webhook: string;
    autoload: boolean;
    status: ClienteStatus;
    constructor(_id: string, _domain: string, _webhook: string) {
        this._id = _id;
        this.domain = _domain;
        this.webhook = _webhook;
        this.autoload = true;
        this.status = new ClienteStatus();
    }

}