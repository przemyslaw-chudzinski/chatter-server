const WsActionBase = require('../ws-action.base');
const wsActions = require('../ws-server-actions');

class WsContactStatusChangedAction extends WsActionBase {
    constructor(event) {
        super(wsActions.ContactStatusChanged, event);
    }

    init(event, wsServer) {

    }
}

module.exports = WsContactStatusChangedAction;