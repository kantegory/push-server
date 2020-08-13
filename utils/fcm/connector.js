// dependecies
const admin = require("firebase-admin");

// credentials
const serviceAccount = require("../../config/push-server.json");

// init application
const fcmApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://push-server-5e46d.firebaseio.com"
});

module.exports = fcmApp;
