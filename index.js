// module meta
const __moduleName = 'main';

// config params & deps
const configParser = require('./utils/configParser');
const __configPath = './config/config.ini';
const __config = configParser(__configPath, __moduleName);

// dependecies
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');

// app params
const port = __config.port;

server.listen(port);

// middlewares
app.use(express.static(`${__dirname}/client/`));
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

app.get('/notification', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
})

app.post('/saveToken', (req, res) => {
  let body = req.body;
  let token = body.token;

  console.log("NEW USER TOKEN IS", token);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

app.post('/send', (req, res) => {
  let body = req.body;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

// socket.io logic
let connections = [];

io.sockets.on('connection', (socket) => {
  console.log('SUCCESS CONNECTION');
  connections.push(socket);

  socket.on('disconnect', (data) => {
    connections.splice(connections.indexOf(socket), 1);
    console.log('DISCONNECT');
  })

  socket.on('sendPush', (data) => {
    // send push to users in online
    io.sockets.emit('showPush', { text: data.text });
    console.log('PUSH SENDED SUCCEFULLY');
  })
})
