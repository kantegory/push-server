const client = require('../connector')

// dependecies
const getSubscriptions = require('./getSubscriptions');

const saveSubscription = async (userId, topicId) => {

  userId = Number(userId);
  topicId = Number(topicId);

  let query = {
    text: 'INSERT INTO subscription (user_id, topic_ids) VALUES ($1, $2);',
    values: [userId, JSON.stringify([topicId])]
  }

  // get all of user previous subsctiptions
  let subscriptions = await getSubscriptions(userId);

  // check if not empty, then update subscriptions
  if (subscriptions.length) {
    let topics = subscriptions[0].topic_ids;

    // check if topics not includes current topic, then add
    if (!topics.includes(topicId)) {
      topics.push(topicId);
    }

    topics = JSON.stringify(topics);

    query = {
      text: 'UPDATE subscription SET topic_ids = $2 WHERE user_id = $1;',
      values: [userId, topics],
    }
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveSubscription;
