const client = require('../connector')

// dependecies
const getSubscriptions = require('./getSubscriptions');

const saveSubscription = async (userId, topicId, isUnsubscribe) => {

  userId = Number(userId);
  let _topicId = JSON.stringify(topicId);

  // process topicId
  if (typeof(topicId) !== 'object') {
    _topicId = [JSON.stringify[Number(topicId)]];
  }

  let query = {
    text: 'INSERT INTO subscription (user_id, topic_ids) VALUES ($1, $2);',
    values: [userId, _topicId]
  }

  // get all of user previous subsctiptions
  let subscriptions = await getSubscriptions(userId);

  // check if not empty, then update subscriptions
  if (subscriptions.length) {
    let topics = subscriptions[0].topic_ids;

    if (typeof(topicId) !== 'object') {
      topicId = Number(topicId);
      // check if topics not includes current topic, then add
      if (!topics.includes(topicId) && !isUnsubscribe) {
        topics.push(topicId);
      }

      // check if isUnsubscribe, then remove element from array
      else if (topics.includes(topicId) && isUnsubscribe) {
        let topicIndex = topics.indexOf(topicId);

        topics.splice(topicIndex, 1);
      }

      topics = JSON.stringify(topics);

      query = {
        text: 'UPDATE subscription SET topic_ids = $2 WHERE user_id = $1;',
        values: [userId, topics],
      }
    } else {
      topicId = topicId.map((_topic) => { return Number(_topic) });

      if (isUnsubscribe) {
        for (let _topic of topicId) {
          console.log('i want unsubscribe from', _topic);

          if (topics.includes(_topic)) {
            topics = topics.splice(topics.indexOf(_topic), 1);

            // exception
            if (topics.length === 1 && topics[0] === _topic) {
              topics = [];
            }
          }

        }
      } else {
        topics = topicId;
      }

      console.log('topics after splice', topics);

      topics = JSON.stringify(topics);

      query = {
        text: 'UPDATE subscription SET topic_ids = $2 WHERE user_id = $1;',
        values: [userId, topics],
      }
    }
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveSubscription;
