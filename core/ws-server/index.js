const WebSocketServer = require('./ws-server');

let wsInstance = null;

const getInstance = () => {
    if (!wsInstance) {
        wsInstance = new WebSocketServer();
    }
    return wsInstance;
};

const port = process.env.PROD ? 3000 : 3001;

const listen = () => wsInstance.listen(port);

module.exports = {
    getInstance,
    listen
};