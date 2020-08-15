// get app
const fcmApp = require('./connector');

// ununsubscribe function
const unsubscribe = (tokens, topic) => {
  fcmApp.messaging().unsubscribeFromTopic(tokens, topic)
    .then(function(response) {
      console.log("Successfully unsubscribed from topic:", response);
    })
    .catch(function(error) {
      console.log("Error unsubscribing from topic:", error);
    });
}

module.exports = unsubscribe;
