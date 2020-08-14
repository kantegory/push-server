const client = require('../connector')

const saveTopic = async (title, description) => {

  let _res = [];

  const query = {
    text: 'INSERT INTO topic (title, description) VALUES ($1, $2) RETURNING id;',
    values: [title, description],
  }

  _res = await client.query(query)

  return _res.rows;
}

module.exports = saveTopic;
