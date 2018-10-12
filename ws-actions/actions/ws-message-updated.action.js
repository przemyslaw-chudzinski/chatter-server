const WsActionBase = require('../ws-action.base');
const wsActions = require('../ws-server-actions');

class WsMessageUpdatedAction extends WsActionBase {
    constructor(event) {
        super(wsActions.MessageUpdated, event);
    }

    init(event, wsServer) {
        const data = JSON.stringify({
            action: wsActions.MessageUpdated,
            data: event.data
        });
        wsServer.sendToOne(event.data.recipientId, data);
    }
}

module.exports = WsMessageUpdatedAction;