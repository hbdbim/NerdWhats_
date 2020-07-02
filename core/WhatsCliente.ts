import { create, Whatsapp, SocketState, Message, Ack, Chat, WhatsappProfile } from 'venom-bot';

import axios from 'axios';
import { ClienteModel } from '../model/cliente-model';
import { ClienteState } from '../model/enum-status';
import { ClienteStatus } from '../model/cliente-status';
import { send } from 'process';


export class WhatsCliente {

    model: ClienteModel;
    whatsPrefix: string = '@c.us';
    private httpcliente: any;
    private cliente: Whatsapp;
    constructor(_client: ClienteModel) {
        this.model = _client;
        this.model.status = new ClienteStatus();
    }

    create() {
        if (this.model.status.status)
            return this;
        this.model.status.status = ClienteState.INICIANDO;

        create(this.model._id, (base64Qr, asciiQR) => {
            this.model.status.status = ClienteState.QRCODE;
            this.model.status.qrCode = base64Qr;
        }, null,
            {
                headless: true, // Headless chrome
                devtools: false, // Open devtools by default
                useChrome: false, // If false will use Chromium instance
                debug: false, // Opens a debug session
                logQR: false, // Logs QR automatically in terminal
                browserArgs: [''], // Parameters to be added into the chrome browser instance
                refreshQR: 15000, // Will refresh QR every 15 seconds, 0 will load QR once. Default is 30 seconds
                disableSpins: true
            })
            .then((cli) => { this.start(cli); });

    }

    close() {
        if (this.cliente) {
            this.model.status.status = null;
            this.cliente.close();
        }
    }

    start(client: Whatsapp) {
        this.model.status.status = ClienteState.CONECTADO;
        this.model.status.qrCode = null;
        this.cliente = client;

        this.httpcliente = axios.create({
            baseURL: this.model.webhook,
            headers: { 'tenant': this.model.domain }
        });

        this.sendAllUnreadMessages();

        client.onMessage((message) => { this.onMessage(message) });

        client.onAck((ack) => { this.onAck(ack) });

        //client.onAnyMessage((message) => { this.onMessage(message); });

        client.onStateChange((state) => {
            console.log(state);
            const conflits = [
                SocketState.CONFLICT,
                SocketState.UNLAUNCHED,
            ];
            if (conflits.includes(state)) {
                this.cliente.useHere();
            }
            const closed = [
                SocketState.UNPAIRED
            ];
            if (closed.includes(state)) {
                this.close();
                this.create();
            }
        });
    }

    onAck(ack: Ack) {
        this.callHook(ack);
    }

    onMessage(message: Message) {
        this.downloadFiles([message]);
        this.callHook(message);
    }

    getAllNewMessages = async (): Promise<any> => {
        return await this.cliente.getAllNewMessages();
    }

    getAllUnreadMessages = async (): Promise<any> => {
        var m = await this.cliente.getUnreadMessages(false, false, true);
        for (var i = 0; i < m.length; i++) {
            await this.downloadFiles(m[i].messages);
        }
        return m;
    }

    downloadFiles = async (_messages: Message[]): Promise<any> => {
        for (var i = 0; i < _messages.length; i++) {
            var message = _messages[i];
            if (message.isMedia) {
                message.mediaData['mediaBlob'] = await (await this.cliente.downloadFile(message)).toString('base64');
            }
        }
    }

    getAllChats = async (_withNewMessageOnly?: boolean): Promise<Chat[]> => {
        return await this.cliente.getAllChats(_withNewMessageOnly);
    }

    getNumberProfile = async (contactId: string): Promise<WhatsappProfile> => {
        return await this.cliente.getNumberProfile(contactId + this.whatsPrefix);
    }

    sendText = async (to: string, content: string): Promise<any> => {
        return await this.cliente.sendText(to + this.whatsPrefix, content);
    }

    sendFileFromBase64 = async (to: string, base64: string, filename: string, caption?: string): Promise<any> => {

        return await this.cliente.sendFileFromBase64(to + this.whatsPrefix, base64, filename, caption);
    }

    sendAllUnreadMessages() {
        this.getAllUnreadMessages()
            .then((message) => {
                message.forEach((m) => {
                    this.callHook(m);
                });
            });
        return true;
    }

    callHook(message: any) {
        let post = message.messages || [message];

        this.httpcliente.post('/Mensagem/Hooks', { key: 'tagone', messages: post })
            .then(() => {
                this.cliente.sendSeen(message.chatId || message.id.user + this.whatsPrefix);
            })
            .catch((e) => {
                console.log(e);
            });
    }
}