const WebSocketServer = require('./ws-server');

let wsInstance = null;

const getInstance = () => {
    if (!wsInstance) {
        wsInstance = new WebSocketServer();
    }
    return wsInstance;
};

const listen = (port) => wsInstance.listen(port);

module.exports = {
    getInstance,
    listen
};