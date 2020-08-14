const client = require('../connector')

const getNotifications = async (userId) => {

  let _res = []

  const query = {
    text: 'SELECT * FROM notifications WHERE user_id = $1;',
    values: [Number(userId)],
  }

  _res = await client.query(query);

  return _res.rows
}

module.exports = getNotifications
