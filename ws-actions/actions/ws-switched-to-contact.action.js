const WsActionBase = require('../ws-action.base');
const wsActions = require('../ws-server-actions');

class WsSwitchedToContactAction extends WsActionBase {
    constructor(event) {
        super(wsActions.SwitchedToContact, event);
    }

    init(event, wsServer) {
        const index = wsServer.connections.findIndex(c => c.userId === event.userId);
        index !== -1 && (wsServer.connections[index].switchedUserId = event.contactId);
    }
}

module.exports = WsSwitchedToContactAction;
