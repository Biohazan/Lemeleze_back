const http = require('http');
const app = require('./back/app');


const server = http.createServer(app);

server.on('listening', () => {
  console.log('Listening on ' + 3000);
});
server.timeout = 0
server.listen(3000);
