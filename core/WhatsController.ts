//import { WhatsCliente } from "./WhatsCliente";



//export class WhatsController {
//    clientes: WhatsCliente[];
//    constructor() {
//        this.clientes = globalThis.clientList;
//    }

//    addCliente(id: string, domain: string) {
//        let cliente = this.clientes.find(w => w.clienteId == id);
//        if (!cliente) {
//            let cli = new WhatsCliente(id, domain);
//            this.clientes.push(cli);
//            cli.create();
//        }
//    }

//    getCliente(id: string) {
//        return this.clientes.find(w => w.clienteId == id);
//    }

//    getAllNewMessages(id: string) {
//        const cli = this.getCliente(id);
//        if (!cli)
//            return null;

//        return cli.getAllNewMessages();
//    }

//    getAllUnreadMessages(id: string) {
//        const cli = this.getCliente(id);
//        if (!cli)
//            return null;

//        return cli.getAllUnreadMessages();
//    }

//    getAllChats(id: string) {
//        const cli = this.getCliente(id);
//        if (!cli)
//            return null;

//        return cli.getAllChats();
//    }

//    getNumberProfile(id: string, contactId: string) {
//        const cli = this.getCliente(id);
//        if (!cli)
//            return null;

//        return cli.getNumberProfile(contactId);
//    }

//    sendText(id: string, to: string, content: string) {
//        const cli = this.getCliente(id);
//        if (!cli)
//            return null;

//        return cli.sendText(to, content);
//    }

//    sendAllUnreadMessages(id: string) {
//        const cli = this.getCliente(id);
//        if (!cli)
//            return null;

//        return cli.sendAllUnreadMessages();
//    }

//}