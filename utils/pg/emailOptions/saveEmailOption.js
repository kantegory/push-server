const client = require('../connector')

// dependecies
const getEmailOptions = require('./getEmailOptions');

const saveEmailOption = async (userId, topicId, isUnsubscribe) => {

  userId = Number(userId);

  let _topicId = JSON.stringify(topicId);

  // process topicId
  if (typeof(topicId) !== 'object') {
    _topicId = [JSON.stringify[Number(topicId)]];
  } else {
    topicId = topicId.map((_topic) => { return Number(_topic) });
    _topicId = JSON.stringify(topicId);
  }

  let query = {
    text: 'INSERT INTO email_options (user_id, topic_ids) VALUES ($1, $2);',
    values: [userId, _topicId]
  }

  // get all of user previous subsctiptions
  let email_options = await getEmailOptions(userId);

  // check if not empty, then update email_options
  if (email_options.length) {
    let topics = email_options[0].topic_ids;

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
        text: 'UPDATE email_options SET topic_ids = $2 WHERE user_id = $1;',
        values: [userId, topics],
      }
    } else {
      topicId = topicId.map((_topic) => { return Number(_topic) });

      topics = JSON.stringify(topicId);

      console.log('updated email options', topics);

      query = {
        text: 'UPDATE email_options SET topic_ids = $2 WHERE user_id = $1;',
        values: [userId, topics],
      }
    }
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })
}

module.exports = saveEmailOption;
