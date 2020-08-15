const client = require('../connector')

const getUserEmail = async (userId) => {

  let _res = []

  const query = {
    text: 'SELECT * FROM user_emails WHERE user_id = $1;',
    values: [Number(userId)],
  }

  _res = await client.query(query);

  return _res.rows
}

module.exports = getUserEmail;
