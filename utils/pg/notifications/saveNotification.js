const client = require('../connector')

const saveNotification = (values) => {

  const query = {
    text: 'INSERT INTO notifications (timestamp, text, type) VALUES ($1, $2, $3);',
    values: values,
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveNotification;
