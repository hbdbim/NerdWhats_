//import { DataModel } from "./model/data-model";
//import { config } from "./config";
//import { ClientesController } from "./api/cliente-controller";
//import { WhatsController } from "./core/WhatsController";
//import { WhatsCliente } from "./core/WhatsCliente";


//const Hapi = require('@hapi/hapi');
//const jsonfile = require('jsonfile');
//declare var dataBase: DataModel;
//declare var clientList: WhatsCliente[];

//const init = async () => {    

//    let database = globalThis.dataBase = new DataModel();
//    globalThis.clientList = [];
//    const jData = jsonfile.readFileSync(config.datafile);
//    Object.assign(globalThis.dataBase, jData);

//    let whatsController = new WhatsController();

//    database.clientes.forEach((data) => {
//        whatsController.addCliente(data.id, data.domain);
//    });

//    const server = Hapi.server({
//        port: 3000,
//        host: 'localhost'
//    });

//    await server.register({
//        plugin: require('hapi-dev-errors'),
//        options: {
//            showErrors: true
//        }
//    });

//    await server.register({
//        plugin: require('hapi-dev-errors'),
//        options: {
//            showErrors: process.env.NODE_ENV !== 'production'
//        }
//    })

//    ClientesController.routes.forEach((r) => {
//        server.route({
//            method: r.method,
//            path: r.path,
//            handler: r.handler
//        });
//    });

//    server.route({
//        method: 'GET',
//        path: '/',
//        handler: (request, h) => {
//            return 'alooooouuu!!!';
//        }
//    });

//    await server.start();
//    console.log('Server running on %s', server.info.uri);
//};

//init();