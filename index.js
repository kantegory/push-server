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
const cors = require('cors');

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
// -- user emails
const saveUserEmail = require('./utils/pg/userEmails/saveUserEmail');
const getUserEmail = require('./utils/pg/userEmails/getUserEmail');
// -- email options
const saveEmailOption = require('./utils/pg/emailOptions/saveEmailOption');
const getEmailOptions = require('./utils/pg/emailOptions/getEmailOptions');

// FCM functions
const sendPush = require('./utils/fcm/send');
const sendToTopic = require('./utils/fcm/sendToTopic');
const subscribe = require('./utils/fcm/subscribe');
const unsubscribe = require('./utils/fcm/unsubscribe');

// Mailer functions
const sendEmail = require('./utils/mailer/sendEmail');

// app params
const port = __config.port;

server.listen(port);

// middlewares
app.use(express.static(`${__dirname}/client/`));
app.use(bodyParser.json());
app.use(cors());

// routes
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/client/index.html`);
})

// -- REST API endpoints
// -- -- save token endpoint
app.post('/saveToken', async (req, res) => {
  // get body from request
  let body = req.body;

  // get data from body
  let token = body.token;
  let userId = body.userId;

  console.log(`NEW TOKEN FOR USER ID ${userId} IS ${token}`);

  // save user device to db
  saveUserDevice(userId, token);

  // check user subscriptions
  let subscriptions = await getSubscriptions(userId);

  // if user has any subscriptions, we should subscribe his new device to them
  if (subscriptions.length) {
    let userSubscriptions = subscriptions[0].topic_ids;

    // get topic titles for each user subscription
    let topicTitles = [];

    for (let subscription of userSubscriptions) {
      let topic = await getTopics(subscription);
      let topicTitle = topic[0].title;
      topicTitles.push(topicTitle);
    }

    // resubscribe user to each topic
    for (let topic of topicTitles) {
      subscribe(token, topic);
    }
  }

  // send response
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

// -- -- send push endpoint
app.post('/send', async (req, res) => {
  let body = req.body;

  let payload = body.payload;
  let tokens = body.tokens;
  let isToTopic = body.isToTopic;

  // check if push is to topic, then send
  if (isToTopic) {
    let topicId = body.topicId;

    // get topic title
    let topicTitle = await getTopics(topicId);
    topicTitle = topicTitle[0].title;

    // send push
    sendToTopic(topicTitle, payload);

    // send email
    // -- get emails for send
    let userEmails = [];

    let emailOptions = await getEmailOptions('all');

    // -- -- get options for each email, then push to userEmails
    for (let emailOption of emailOptions) {
      if (emailOption.topic_ids.includes(topicId)) {
        let userEmail = await getUserEmail(emailOption.user_id);

        userEmail = userEmail[0].user_email;

        userEmails.push(userEmail);
      }
    }

    // -- finally send email
    let subject = payload.notification.title;
    let text = payload.notification.body;

    sendEmail(userEmails, subject, text);
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

app.get('/topic/all', async (req, res) => {
  // get all topics
  let topics = await getTopics('all');

  // convert topics to json
  topics = JSON.stringify(topics);

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(`{"success": true, "topics": ${topics}}`);
  res.end();
})

app.get('/topic/:id', async (req, res) => {
  let topicId = req.params.id;

  // get topic
  let topic = await getTopics(topicId);

  // convert topics json
  topic = JSON.stringify(topic[0]);

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(`{"success": true, "topic": ${topic}}`);
  res.end();
})

// -- -- subsription endpoint
app.post('/subscribe', async (req, res) => {
  let body = req.body;

  let userId = body.userId;
  let topicId = body.topicId;
  let isUnsubscribe = body.unsubscribe;

  // get user devices for subscribe them
  let userDevices = await getUserDevices(userId);

  // get user tokens
  let userTokens = userDevices[0].tokens;

  // get topic title 
  // check if we get an array
  if (typeof(topicId) === 'object' && topicId.length) {
    // subscribe for each topic
    for (let _topicId of topicId) {
      let topic = await getTopics(_topicId);
      let topicTitle = topic[0].title;

      // check if unsubscribe
      if (isUnsubscribe) {
        // unsubscribe user from topic
        unsubscribe(userTokens, topicTitle);
      } else {
        // subscribe user to topic
        subscribe(userTokens, topicTitle);
      }

      // save data to db
      saveSubscription(userId, _topicId, isUnsubscribe);
    }

    // success
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('{"success": true}');
    res.end();

    return;
  }

  let topic = await getTopics(topicId);
  let topicTitle = topic[0].title;

  // check if unsubscribe
  if (isUnsubscribe) {
    // unsubscribe user from topic
    unsubscribe(userTokens, topicTitle);
  } else {
    // subscribe user to topic
    subscribe(userTokens, topicTitle);
  }

  // save data to db
  saveSubscription(userId, topicId, isUnsubscribe);

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

app.get('/subscription/:userId', async (req, res) => {
  // get userId from params
  let userId = req.params.userId;

  // get user subscriptions
  let subscriptions = await getSubscriptions(userId);

  // extract subscriptions
  subscriptions = subscriptions[0].topic_ids;

  // stringify
  subscriptions = JSON.stringify(subscriptions);

  // get user email options
  let emailOptions = await getEmailOptions(userId);

  // extract
  emailOptions = emailOptions[0].topic_ids;

  // stringify
  emailOptions = JSON.stringify(emailOptions);

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(`{"success": true, "subscriptions": ${subscriptions}, "emailOptions": ${emailOptions}}`);
  res.end();
})

// -- -- user email endpoints
app.post('/user/email/add', (req, res) => {
  let body = req.body;

  let userId = body.userId;
  let userEmail = body.userEmail;

  // save data to db
  saveUserEmail(userId, userEmail);

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})

app.get('/user/email/:userId', async (req, res) => {
  let userId = req.params.userId;

  // get user email
  let userEmail = await getUserEmail(userId);
  userEmail = userEmail[0].user_email;

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(`{"success": true, "user_email": ${userEmail}}`);
  res.end();
})

// -- -- email options endpoint
app.post('/user/email/options', async (req, res) => {
  let body = req.body;

  let userId = body.userId;
  let topicId = body.topicId;
  let isUnsubscribe = body.unsubscribe;

  // save data to db
  saveEmailOption(userId, topicId, isUnsubscribe);

  // success
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write('{"success": true}');
  res.end();
})
