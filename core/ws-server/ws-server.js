const ws = require('nodejs-websocket');
const wsActions = require('./ws-server-actions');

class WebSocketServer {
    constructor(port = 8000, host = 'localhost', cb) {
        this._port = port;
        this._host = host;
        this._cb = cb || function () {
            console.log(`Websocket Server is running on ws://${host}:${port}`);
        };
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
        conn.on('error', err => console.log(err));
    }

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
        }
    }

    __onCloseHandler(conn, event) {
        this._sendToAll(this._prepareDataToSend());
    }

    _userLoggedAction(event) {
        this._sendToAll(this._prepareDataToSend());
    }

    _userLoggedOutAction() {
        const index = serverWs.connections.findIndex(c => c.userId === event.userId);
        if (index !== -1) {
            this._connections.splice(index, 1);
        }
        this._sendToAll(this._prepareDataToSend());
    }

    _sendToAll(data) {
        this._connections.forEach(c => {
            c.sendText(data)
        });
    }

    _prepareDataToSend() {
        return JSON.stringify({
            action: wsActions.ContactStatusChanged,
            visibleContactsIds: this._server.connections.map(c => c.userId)
        });
    }
}

module.exports = WebSocketServer;