const app = require('./app');
const serverConfig = require('./config/http-server/server-dev');
const WebSocketServer = require('./core/ws-server/index');

app.listen(serverConfig.port, () => console.log('Http Server is running on http://localhost:' + serverConfig.port));

const wsServer = new WebSocketServer();
wsServer.listen();

module.exports = app;