// get app
const fcmApp = require('./connector');

// subscribe function
const subscribe = (tokens, topic) => {
  fcmApp.messaging().subscribeToTopic(tokens, topic)
    .then(function(response) {
      console.log("Successfully subscribed to topic:", response);
    })
    .catch(function(error) {
      console.log("Error subscribing to topic:", error);
    });
}

module.exports = subscribe;
