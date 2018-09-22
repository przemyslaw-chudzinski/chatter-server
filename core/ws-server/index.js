const ws = require('nodejs-websocket');
const wsActions = require('./ws-server-actions');
const MessagesModel = require('../../db/models/messages.model');
const wsNotifications = require('./ws-server-notifications');

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

    /**
     * @desc It returns all connections
     * @private
     */
    get connections() {
        return this._server.connections;
    }

    /**
     * @param connections
     */
    set connections(connections) {
        this._server.connections = connections;
    }

    /**
     * @desc It returns number of connections
     * @returns {*}
     */
    get length() {
        return this.connections.length;
    }

    /**
     * @desc It starts server
     */
    listen() {
        this._server.listen(this._port, this._host, this._cb);
    }

    _wsCreateServerCallback(conn) {
        this._assignEvents(conn);
    }

    _assignEvents(conn) {
        conn.on('text', event => this._onTextHandler(conn, event));
        conn.on('close', event => this._onCloseHandler(conn, event));
        conn.on('error', () => console.log('ws on error'));
    }

    /**
     * @param conn
     * @param event
     * @private
     */
    _onTextHandler(conn, event) {
        event = JSON.parse(event);
        conn.userId = event.userId;
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
            case wsActions.NotifyContact:
                break;
            case wsActions.MessageUpdated:
                this._messageUpdatedAction(event);
                break;
        }
    }

    _onCloseHandler(conn, event) {
        this.connections = this.connections.filter(c => c.userId !== conn.userId);
        this.sendToAll(JSON.stringify({
            action: wsActions.ContactStatusChanged,
            visibleContactsIds: this.connections.map(c => c.userId)
        }));
    }

    _userLoggedAction(event) {
        const visibleContactsIds = this.connections.map(c => c.userId);
        this.sendToAll(JSON.stringify({
            action: wsActions.ContactStatusChanged,
            visibleContactsIds
        }));
    }

    _userLoggedOutAction(event) {
        const index = this._server.connections.findIndex(c => c.userId === event.userId);
        if (index !== -1) {
            this.connections.splice(index, 1);
        }
        this.sendToAll(JSON.stringify({
            action: wsActions.ContactStatusChanged,
            visibleContactsIds: this.connections.map(c => c.userId)
        }));
    }

    _messageToContactAction(event) {
        const data = JSON.stringify({
            action: wsActions.MessageToContact,
            data: event.data
        });
        this._sendToOne(event.data.recipientId, data);
    }

    _switchedToContactAction(event) {
        const index = this.connections.findIndex(c => c.userId === event.userId);
        if (index !== -1) {
            this.connections[index].switchedUserId = event.contactId;
        }
    }

    sendToAll(data) {
        this.connections.forEach(c => {
            c.sendText(data);
        });
    }

    _sendToOne(recipientId, data) {
        const c = this.connections.find(c => c.userId === recipientId);
        return c && c.sendText(data);
    }

    // _prepareDataOnStatusChanged() {
    //     return JSON.stringify({
    //         action: wsActions.ContactStatusChanged,
    //         visibleContactsIds: this.connections.map(c => c.userId)
    //     });
    // }

    _saveMessage(message) {
        // message.read = true;
        const index = this.connections.findIndex(c => c.userId === message.recipientId);
        if (index !== -1) {
            const recipientConn = this.connections[index];
            if (recipientConn.switchedUserId !== message.authorId) {
                // message.read = false;
                this._notifyContact(message.recipientId, message.authorId, wsNotifications.NewMessage);
            }
        } else {
            this._notifyContact(message.recipientId, message.authorId, wsNotifications.NewMessage);
        }
        return this._messagesModel.saveMessage(message);
    }

    _notifyContact(recipientId, userId, type = wsNotifications.NewMessage) {
        const data = JSON.stringify({
            action: wsActions.NotifyContact,
            type,
            data: 'You received new message',
            contactId: userId
        });
        this._sendToOne(recipientId, data);
    }

    _messageUpdatedAction(event) {
        const data = JSON.stringify({
            action: wsActions.MessageUpdated,
            data: event.data
        });
        this._sendToOne(event.data.recipientId, data);
    }
}

module.exports = WebSocketServer;