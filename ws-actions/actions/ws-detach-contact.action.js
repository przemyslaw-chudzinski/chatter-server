const WsActionBase = require('../ws-action.base');
const wsActions = require('../ws-server-actions');

class WsDetachContactAction extends WsActionBase {
    constructor(event) {
        super(wsActions.DetachContact, event);
    }

    init(event, wsServer) {
        const {userId} = event;
        const index = wsServer.connections.findIndex(c => c.userId === userId);
        index !== -1 && (wsServer.connections[index].switchedUserId = null);
    }
}

module.exports = WsDetachContactAction;
