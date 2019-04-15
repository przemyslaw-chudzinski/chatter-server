const wsActions = require('../../../ws-actions/ws-server-actions');

const mapRecipientsIds = (members, loggedUserId) => members && members.length && members.map(member => member.memberId !== loggedUserId ? member.memberId : null).filter(i => !!i);

function notifyUnconfirmedMembers(members, data, action = wsActions.ReceivedNotification) {
    members && members.length && members.forEach(member => {
        !member.confirmed && this.wsServer.sendToOne(member.memberId, JSON.stringify({
            action,
            data
        }));
    });
}

module.exports = {
    mapRecipientsIds,
    notifyUnconfirmedMembers
};
