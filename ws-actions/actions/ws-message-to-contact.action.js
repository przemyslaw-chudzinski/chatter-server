const WsActionBase = require('../ws-action.base');
const wsActions = require('../ws-server-actions');

class WsMessageToContactAction extends WsActionBase {
    constructor(event) {
        super(wsActions.MessageToContact, event);
    }

    init(event, wsServer) {
        const data = JSON.stringify({
            action: wsActions.MessageToContact,
            data: event.data
        });
        wsServer.sendToOne(event.data.recipientId, data);
        const conn = wsServer.connections.find(c => c.userId === event.data.recipientId);

        if (conn) {
            if (conn.switchedUserId && event.data.authorId === conn.switchedUserId) {
                console.log('user connected');
                // is connected
            } else if (conn.switchedUserId && event.data.authorId !== conn.switchedUserId) {
                // is connected to other user
                wsServer.notifyContact(event.data.recipientId, event.data.authorId);
            } else {
                // con is not connected to any user
                wsServer.notifyContact(event.data.recipientId, event.data.authorId);
            }
        } else {
            // conn is logged out
        }
    }
}

module.exports = WsMessageToContactAction;
