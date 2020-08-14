const client = require('../connector')

const saveSubscription = (values) => {

  const query = {
    text: 'INSERT INTO subscriptions (timestamp, text, type) VALUES ($1, $2, $3);',
    values: values,
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveSubscription;
