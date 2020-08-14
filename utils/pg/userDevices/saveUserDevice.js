const client = require('../connector')

// dependecies
const getUserDevices = require('./getUserDevices');

const saveUserDevice = async (values) => {

  let userId = Number(values[0]);
  let deviceToken = values[1];

  let query = {
    text: 'INSERT INTO user_devices (user_id, tokens) VALUES ($1, $2);',
    values: [userId, JSON.stringify([deviceToken])],
  }

  // get all of user previous device tokens
  let userDevices = await getUserDevices(userId);

  // check if not empty, then update devices
  if (userDevices.length) {
    console.log("devices are", userDevices);
    let tokens = userDevices[0].tokens;

    // check if tokens not includes current token, then add
    if (!tokens.includes(deviceToken)) {
      tokens.push(deviceToken);
    }

    tokens = JSON.stringify(tokens);

    query = {
      text: 'UPDATE user_devices SET tokens = $2 WHERE user_id = $1;',
      values: [userId, tokens],
    }
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveUserDevice;
