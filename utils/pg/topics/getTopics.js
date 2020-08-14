const client = require('../connector')

const getTopics = async (topicId) => {

  let _res = []

  const query = {
    text: 'SELECT * FROM topic WHERE id = $1;',
    values: [Number(topicId)]
  }

  _res = await client.query(query);

  return _res.rows
}

module.exports = getTopics;
