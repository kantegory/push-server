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
const bodyParser = require('body-parser');

// FCM functions
const sendPush = require('./utils/fcm/send');

// app params
const port = __config.port;

server.listen(port);

// middlewares
app.use(express.static(`${__dirname}/client/`));
app.use(bodyParser.json());

// routes
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
})

app.post('/saveToken', (req, res) => {
  let body = req.body;
  
  let token = body.token;
  let userId = body.userId;

  console.log(`NEW TOKEN FOR USER ID ${userId} IS ${token}`);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

app.post('/send', (req, res) => {
  let body = req.body;
  let payload = body.payload;
  let tokens = body.tokens;

  sendPush(tokens, payload);

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})
