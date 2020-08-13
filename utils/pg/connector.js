// module meta
const __moduleName = 'database';

// config params & deps
const configParser = require('../utils/configParser');
const __configPath = './config/config.ini';
const __config = configParser(__configPath, __moduleName);

// dependecies
const { Client } = require('pg')

// client init
const client = new Client({
  user: __config.user,
  host: __config.host,
  database: __config.name,
  password: __config.password,
  port: __config.port
})

client.connect()

module.exports = client
