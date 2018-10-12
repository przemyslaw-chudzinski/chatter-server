const wsServer = require('../core/ws-server');

class WsActionBase {
    constructor(actionName) {
        this._actionName = actionName;
    }

    init(event, wsServer) {
        console.log(console.log(this.actionName + ' fired'))
    }

    /**
     * @desc It returns name of the action
     * @returns {*}
     */
    get actionName() {
        return this._actionName;
    }

    /**
     * @desc It returns the websocket server instance
     * @returns {WebSocketServer}
     */
    get wsServer() {
        return wsServer.getInstance();
    }
}

module.exports = WsActionBase;