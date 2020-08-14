const client = require('../connector')

const saveUserDevice = (values) => {

  const query = {
    text: 'INSERT INTO user_devices (user_id, tokens) VALUES ($1, $2);',
    values: [Number(values[0]), JSON.stringify(values[1])],
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveUserDevice;
