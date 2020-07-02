import Repository from '../../common/base-repository';
import Resolver from '../../common/base-resolver';
import { ClienteModel } from '../../model/cliente-model';

export default class ClienteResolver extends Resolver<ClienteModel> {
    constructor() {
        super(new Repository());
    }

    public async getByToken(_token: string): Promise<ClienteModel> {
        return new Promise((resolve, reject) => {
            this.repository.dataSource.findOne({ token: _token }, {}, (error, documents) => {
                if (error) {
                    reject(error);
                }
                resolve(documents as ClienteModel);
            });
        });
        ;
    }
}
