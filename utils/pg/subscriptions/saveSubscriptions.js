const client = require('../connector')

const saveSubscription = (userId, topicId) => {

  const query = {
    text: 'INSERT INTO subscriptions (user_id, topic_id) VALUES ($1, $2);',
    values: [Number(userId), Number(topicId)]
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveSubscription;
