const client = require('../connector')

const getUserDevices = async (userId) => {

  let _res = []

  const query = {
    text: 'SELECT * FROM user_devices WHERE user_id = $1;',
    values: [Number(userId)],
  }

  _res = await client.query(query);

  return _res.rows
}

module.exports = getUserDevices;
