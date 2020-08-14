const client = require('../connector')

const getSubscriptions = async (userId) => {

  let _res = []

  const query = {
    text: 'SELECT * FROM subscription WHERE user_id = $1;',
    values: [Number(userId)],
  }

  _res = await client.query(query);

  return _res.rows
}

module.exports = getSubscriptions;
