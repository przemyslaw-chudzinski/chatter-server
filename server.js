const app = require('./app');
// const serverConfig = require('./config/http-server/server-dev');
const wsServer = require('./core/ws-server');

const WsUserLoggedAction = require('./ws-actions/actions/ws-user-logged.action');
const WsUserLoggedOutAction = require('./ws-actions/actions/ws-user-logged-out.action');
const WsContactStatusChangedAction = require('./ws-actions/actions/ws-contact-status-changed.action');
// const WsMessageToContactAction = require('./ws-actions/actions/ws-message-to-contact.action');
const WsSwitchedToContactAction = require('./ws-actions/actions/ws-switched-to-contact.action');
const WsNotifyContactAction = require('./ws-actions/actions/ws-notify-contact.action');
const WsMessageUpdatedAction = require('./ws-actions/actions/ws-message-updated.action');
const WsDetachContactAction = require('./ws-actions/actions/ws-detach-contact.action');

app.listen(process.env.PORT, () => console.log('Http Server is running on http://localhost:' + process.env.PORT));

const port = process.env.PROD ? 81 : 3001;

wsServer
    .getInstance()
    .registerActions([
        WsUserLoggedAction,
        WsUserLoggedOutAction,
        WsContactStatusChangedAction,
        // WsMessageToContactAction,
        WsSwitchedToContactAction,
        WsNotifyContactAction,
        WsMessageUpdatedAction,
        WsDetachContactAction
    ])
    .listen(port);

module.exports = app;
