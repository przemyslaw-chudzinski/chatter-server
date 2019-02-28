const wsActions = require('../../../ws-actions/ws-server-actions');

const mapRecipientsIds = (members, loggedUserId) => members && members.length && members.map(member => member.memberId !== loggedUserId ? member.memberId : null).filter(i => !!i);

function notifyMembers(members, data) {
    members && members.length && members.forEach(member => {
        !member.confirmed && this.wsServer.sendToOne(member.memberId, JSON.stringify({
            action: wsActions.ReceivedNotification,
            data
        }));
    });
}

module.exports = {
    mapRecipientsIds,
    notifyMembers
};
