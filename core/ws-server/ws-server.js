const ws = require('nodejs-websocket');
const wsActions = require('../../ws-actions/ws-server-actions');
const wsNotifications = require('./ws-server-notifications');

class WebSocketServer {
    constructor(cb) {
        // this._host = 'localhost';
        this._actions = [];
        this._cb = cb || function () {
            console.log(`Websocket Server is running on ws://localhost:${process.env.PORT}`);
        };
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
    listen(port) {
        this._server.listen(port);
    }

    registerActions(actions = []) {
        // this._actions.push(actions);
        // todo check a name of the action is unique ??
        if (actions && actions.length) {
            actions.forEach(action => this._actions.push(new action));
        }
        return this;
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
        if (conn && !conn.userId) {
            conn.userId = event.userId;
        }

        if (this._actions.length) {
            this._actions.forEach(action => {
                event.action === action.actionName ? action.init(event, this, conn) : null;
            });
        }
    }

    _onCloseHandler(conn, event) {
        this.connections = this.connections.filter(c => c.userId !== conn.userId);
        this.sendToAll(JSON.stringify({
            action: wsActions.ContactStatusChanged,
            visibleContactsIds: this.connections.map(c => c.userId)
        }));
    }

    /**
     * @desc It sends a message to contact
     * @param message
     */
    messageToContact(message) {
        const data = JSON.stringify({
            action: wsActions.MessageToContact,
            data: message
        });
        this.sendToOne(message.recipientId, data);
        const conn = this.connections.find(c => c.userId === message.recipientId);

        if (conn) {
            if (conn.switchedUserId && message.authorId === conn.switchedUserId) {
                // is connected
                message.read = true;
                message.readAt = new Date();
            } else if (conn.switchedUserId && message.authorId !== conn.switchedUserId) {
                // is connected to other user
                this.notifyContact(message.recipientId, message.authorId);
            } else {
                // con is not connected to any user
                this.notifyContact(message.recipientId, message.authorId);
            }
        } else {
            // conn is logged out
        }
    }

    sendToAll(data) {
        this.connections.forEach(c => {
            c.sendText(data);
        });
    }

    sendToOne(recipientId, data) {
        const c = this.connections.find(c => c.userId === recipientId);
        return c && c.sendText(data);
    }

    notifyContact(recipientId, userId, type = wsNotifications.NewMessage) {
        const data = JSON.stringify({
            action: wsActions.NotifyContact,
            type,
            data: 'You received new message',
            contactId: userId
        });
        this.sendToOne(recipientId, data);
    }

    /**
     * @desc It notifies a contact that author has updated a message
     * @param message
     */
    notifyContactMessageUpdated(message) {
        const data = JSON.stringify({
            action: wsActions.MessageUpdated,
            data: message
        });
        this.sendToOne(message.recipientId, data);
    }
}

module.exports = WebSocketServer;