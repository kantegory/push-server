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

// PG functions
// -- notifications
const saveNotification = require('./utils/pg/notifications/saveNotification');
const getNotifications = require('./utils/pg/notifications/getNotifications');
// -- topics
const saveTopic = require('./utils/pg/topics/saveTopic');
const getTopics = require('./utils/pg/topics/getTopics');
// -- user devices
const saveUserDevice = require('./utils/pg/userDevices/saveUserDevice');
const getUserDevices = require('./utils/pg/userDevices/getUserDevices');
// -- subscriptions
const saveSubscription = require('./utils/pg/subscriptions/saveSubscription');
const getSubscriptions = require('./utils/pg/subscriptions/getSubscriptions');

// FCM functions
const sendPush = require('./utils/fcm/send');
const sendToTopic = require('./utils/fcm/sendToTopic');
const subscribe = require('./utils/fcm/subscribe');

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

// -- REST API endpoints
// -- -- save token endpoint
app.post('/saveToken', (req, res) => {
  // get body from request
  let body = req.body;

  // get data from body
  let token = body.token;
  let userId = body.userId;

  console.log(`NEW TOKEN FOR USER ID ${userId} IS ${token}`);

  // save user device to db
  let values = [userId, token];
  saveUserDevice(values);

  // send response
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

// -- -- send push endpoint
app.post('/send', (req, res) => {
  let body = req.body;

  let payload = body.payload;
  let tokens = body.tokens;
  let isToTopic = body.isToTopic;

  // check if push is to topic, then send
  if (isToTopic) {
    let topic = body.topic;
    sendToTopic(topic, payload);
  } else {
    sendPush(tokens, payload);
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

// -- -- topic endpoint
app.post('/topic', async (req, res) => {
  let body = req.body;

  let title = body.title;
  let description = body.description;

  // save topic to database
  let savedTopic = await saveTopic(title, description);

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(`{"success": true, "topicId": ${savedTopic[0].id}}`);
  res.end();
})

// -- -- subsription endpoint
app.post('/subscribe', async (req, res) => {
  let body = req.body;

  let userId = body.userId;
  let topicId = body.topicId;

  // get user devices for subscribe them
  let userDevices = await getUserDevices(userId);

  // get user tokens
  let userTokens = userDevices[0].tokens;

  // get topic title 
  let topic = await getTopics(topicId);
  let topicTitle = topic[0].title;

  // subscribe user to topic
  subscribe(userTokens, topicTitle);

  // save data to db
  saveSubscription(userId, topicId);

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})
