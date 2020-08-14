const client = require('../connector')

const saveTopic = (values) => {

  const query = {
    text: 'INSERT INTO topic (title, description) VALUES ($1, $2);',
    values: values,
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveTopic;
