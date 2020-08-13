// get app
const fcmApp = require('./connector');

// send function
const send = (tokens, payload) => {
  fcmApp.messaging().sendToDevice(tokens, payload)
    .then(function(response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
}

module.exports = send;
