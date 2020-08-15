const client = require('../connector')

// dependecies
const getUserEmail = require('./getUserEmail');

const saveUserEmail = async (userId, userEmail) => {

  userId = Number(userId);

  let query = {
    text: 'INSERT INTO user_emails (user_id, user_email) VALUES ($1, $2);',
    values: [userId, userEmail],
  }

  // get user previous email
  let prevEmail = await getUserEmail(userId);

  // check if not empty, then update email
  if (prevEmail.length) {
    prevEmail = prevEmail[0].user_email;

    // check if current email is not equal to new email, then update
    if (userEmail === prevEmail) {
      return null;
    }

    query = {
      text: 'UPDATE user_emails SET user_email = $2 WHERE user_id = $1;',
      values: [userId, userEmail],
    }
  }

  client.query(query, (err, res) => {
    if (err) throw err
    console.log('INSERTED')
  })

}

module.exports = saveUserEmail;
