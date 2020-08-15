// get app
const fcmApp = require('./connector');

// sendToTopic function
const sendToTopic = (topic, payload) => {
  fcmApp.messaging().sendToTopic(topic, payload)
    .then(function(response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });

}

module.exports = sendToTopic;
