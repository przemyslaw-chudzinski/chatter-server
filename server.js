const app = require('./app');
const serverConfig = require('./config/http-server/server-dev');
const wsServer = require('./core/ws-server');

app.listen(serverConfig.port, () => console.log('Http Server is running on http://localhost:' + serverConfig.port));

wsServer.createServer();

module.exports = app;