const WsActionBase = require('../ws-action.base');
const wsActions = require('../ws-server-actions');

class WsNotifyContactAction extends WsActionBase {
    constructor(event) {
        super(wsActions.NotifyContact, event);
    }

    init(event, wsServer) {

    }
}

module.exports = WsNotifyContactAction;