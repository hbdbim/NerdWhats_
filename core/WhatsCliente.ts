import { create, Whatsapp, SocketState, Message, Ack, Chat, WhatsappProfile } from '@wppconnect-team/wppconnect';

import axios from 'axios';
import { ClienteModel } from '../model/cliente-model';
import { ClienteState } from '../model/enum-status';
import { ClienteStatus } from '../model/cliente-status';
import Logger from '../helper/logger';
import ClienteResolver from '../api/cliente/cliente-resolver';
import { resolve } from 'dns';

//import { function } from '@hapi/joi';


export class WhatsCliente {

    model: ClienteModel;
    whatsPrefix: string = '@c.us';
    private httpcliente: any;
    private cliente: Whatsapp;
    resolver: ClienteResolver;
    constructor(_client: ClienteModel) {
        this.model = _client;
        //this.model.status = new ClienteStatus();
    }

    create() {
        if (this.model.status.status)
            return this;
        this.model.status.status = ClienteState.INICIANDO;

        create(this.model._id,
            (base64Qr, asciiQR) => {
                this.model.status.status = ClienteState.QRCODE;
                this.model.status.qrCode = base64Qr;
            },
            undefined,
            {
                folderNameToken: 'tokens', //folder name when saving tokens
                mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
                headless: false, // Headless chrome
                devtools: false, // Open devtools by default
                useChrome: true, // If false will use Chromium instance
                debug: false, // Opens a debug session
                browserWS: '', // If u want to use browserWSEndpoint
                browserArgs: [''], // Parameters to be added into the chrome browser instance
                logQR: true, // Logs QR automatically in terminal                
                disableWelcome: true, // Will disable the welcoming message which appears in the beginning
                updatesLog: true, // Logs info updates automatically in terminal
                autoClose: 0, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)                
                createPathFileToken: true,
                waitForLogin: true
            }, null)
            .then((cli) => { cli.waitForLogin().then(() => { this.start(cli); }) }).catch((err) => { Logger.error(`Cliete [${this.model.domain}] erro on create`, err); this.close() });
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

        client.onStateChange((state) => {
            try {
                console.log('State changed: ', state);
                const conflits = [
                    SocketState.CONFLICT,
                    SocketState.UNPAIRED,
                    SocketState.UNLAUNCHED,
                ];
                if (conflits.includes(state)) {
                    this.cliente.useHere();
                    // Detect a logout
                    if (state === 'UNPAIRED')
                        this.close();

                }
            } catch (err) {
                Logger.error(`Cliete [${this.model.domain}] state change ${state}`, err);
            }

        });

        this.httpcliente = axios.create({
            baseURL: this.model.webhook,
            headers: { 'tenant': this.model.domain }
        });

        this.sendAllUnreadMessages();

        client.onMessage((message) => { this.onMessage(message) });


    }

    onAck(ack: Ack) {
        this.callHook(ack);
    }

    onMessage(message: Message) {
        this.downloadFiles([message]).then(() => {
            this.callHook(message);
        });
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
            if (message && (message.isMedia || message.isMMS)) {
                var buffer = await this.cliente.decryptFile(message);
                message.mediaData['mediaBlob'] = await buffer.toString('base64');
            }
        }
    }

    getAllChats = async (_withNewMessageOnly?: boolean): Promise<Chat[]> => {
        return await this.cliente.getAllChats();
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
        if (post)
            for (var i = 0; i < post.length; i++) {
                if (post[i])
                    post[i].isMMS = false;
            }

        this.httpcliente.post('', { key: 'tagone', messages: post })
            .then(() => {
                this.cliente.sendSeen(message.chatId || message.id.user + this.whatsPrefix);
            })
            .catch((err) => {
                Logger.error(`Error calling web hook ${this.model.domain}`, err);
            });
    }
}