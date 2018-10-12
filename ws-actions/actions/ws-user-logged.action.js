const WsActionBase = require('../ws-action.base');
const wsActions = require('../ws-server-actions');

class WsUserLoggedAction extends WsActionBase {
    constructor(event) {
        super(wsActions.UserLogged, event);
    }

    init(event, wsServer) {
        const visibleContactsIds = wsServer.connections.map(c => c.userId);
        wsServer.sendToAll(JSON.stringify({
            action: wsActions.ContactStatusChanged,
            visibleContactsIds
        }));
    }
}

module.exports = WsUserLoggedAction;