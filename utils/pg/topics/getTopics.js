const client = require('../connector')

const getTopics = async () => {

  let _res = []

  const query = {
    text: 'SELECT * FROM topic;',
  }

  _res = await client.query(query);

  return _res.rows
}

module.exports = getTopics;
