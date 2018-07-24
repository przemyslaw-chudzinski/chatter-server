const ws = require('nodejs-websocket');
const wsActions = require('./ws-server-actions');
const MessagesModel = require('../../db/models/messages.model')

class WebSocketServer {
    constructor(cb, port = 8000, host = 'localhost') {
        this._port = port;
        this._host = host;
        this._cb = cb || function () {
            console.log(`Websocket Server is running on ws://${host}:${port}`);
        };
        this._messagesModel = new MessagesModel;
        this._server = ws.createServer(conn => this._wsCreateServerCallback(conn));
    }

    listen() {
        this._server.listen(this._port, this._host, this._cb);
    }

    get _connections() {
        return this._server.connections;
    }

    _wsCreateServerCallback(conn) {
        this._assignEvents(conn);
    }

    _assignEvents(conn) {
        conn.on('text', event => this._onTextHandler(conn, event));
        conn.on('close', event => this.__onCloseHandler(conn, event));
        conn.on('error', () => {
            console.log('ws on error');
        });
    }

    _onTextHandler(conn, event) {
        console.log('text event', event);
        event = JSON.parse(event);
        if (conn.userId) {
            conn.userId = event.userId
        }
        switch (event.action) {
            case wsActions.UserLogged:
                this._userLoggedAction(event);
                break;
            case wsActions.UserLoggedOut:
                this._userLoggedOutAction(event);
                break;
            case wsActions.ContactStatusChanged:
                break;
            case wsActions.MessageToContact:
                this._messageToContactAction(event);
                break;
            case wsActions.SwitchedToContact:
                this._switchedToContactAction(event);
                break;
        }
    }

    __onCloseHandler(conn, event) {
        console.log('ws on close');
        this._sendToAll(this._prepareDataOnStatusChanged());
    }

    _userLoggedAction(event) {
        this._sendToAll(this._prepareDataOnStatusChanged());
    }

    _userLoggedOutAction(event) {
        const index = this._server.connections.findIndex(c => c.userId === event.userId);
        if (index !== -1) {
            this._connections.splice(index, 1);
        }
        this._sendToAll(this._prepareDataOnStatusChanged());
    }

    _messageToContactAction(event) {
        // console.log('event', event);
        if (event.contactId) {
            const data = JSON.stringify({
                action: wsActions.MessageToContact,
                contactId: event.userId,
                data: event.data
            });
            this._saveMessage({
                authorId: event.userId,
                recipientId: event.contactId,
                content: event.data,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            this._sendToOne(event.contactId, data) || console.log('contact is logged out');
        }

    }

    _switchedToContactAction(event) {
        const index = this._connections.findIndex(c => c.userId = event.userId);
        if (index !== -1) {
            this._connections[index].switchedContactId = event.contactId;
        }
    }

    _sendToAll(data) {
        this._connections.forEach(c => {
            c.sendText(data);
        });
    }

    _sendToOne(recipientId, data) {
        const c = this._connections.find(c => c.userId === recipientId);
        console.log('index', c);
        console.log('connections length', this._connections.length);
        return c && c.sendText(data);
        // if (index !== -1) {
        //     this._connections[index].sendText(data);
        //     return true;
        // }
        // return false;
    }

    _prepareDataOnStatusChanged() {
        return JSON.stringify({
            action: wsActions.ContactStatusChanged,
            visibleContactsIds: this._server.connections.map(c => c.userId)
        });
    }

    _saveMessage(message) {
        // message.read = false;
        // const index = this._connections.findIndex(c => c.userId === message.recipientId);
        // if (index !== -1) {
        //     // user is logged
        //     if (this._connections[index].switchedContactId === message.authorId) {
        //         message.read = true;
        //     } else {
        //         // TODO: Create notification that contact has new unread message
        //     }
        // }
        // // TODO: Create notification that contact has new unread message
        // this._messagesModel.saveMessage(message);
    }
}

module.exports = WebSocketServer;