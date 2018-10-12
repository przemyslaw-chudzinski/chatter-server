const WsActionBase = require('../ws-action.base');
const wsActions = require('../ws-server-actions');

class WsUserLoggedOutAction extends WsActionBase {
    constructor() {
        super(wsActions.UserLoggedOut);
    }

    init(event, wsServer) {
        const index = wsServer.connections.findIndex(c => c.userId === event.userId);
        if (index !== -1) {
            wsServer.connections.splice(index, 1);
        }
        wsServer.sendToAll(JSON.stringify({
            action: wsActions.ContactStatusChanged,
            visibleContactsIds: wsServer.connections.map(c => c.userId)
        }));
    }
}

module.exports = WsUserLoggedOutAction;