// module meta
const __moduleName = 'migrations';

// config params & deps
const configParser = require('../configParser');
const __configPath = './config/config.ini';
const __config = configParser(__configPath, __moduleName);

// migrations dir
const migrationsDir = __config.dir;

// client
const client = require('./connector');

// dependecies
const fs = require('fs');

const getMigrations = () => {
  // read migrations dir
  let migrations = fs.readdirSync(migrationsDir);

  // get abspath for each migration
  migrations = migrations.map((filename) => {
    return `${migrationsDir}/${filename}`;
  });

  // get query from each migration
  migrations = migrations.map((abspath) => {
    return fs.readFileSync(abspath, 'utf-8');
  })

  return migrations;
}

const migrate = () => {
  let migrations = getMigrations();
  console.log(migrations);

  for (migration of migrations) {
    client.query(migration, (err, res) => {
      if (err) throw err
      console.log('INSERTED')
    })
  }

  return null;
}

// export module, uncomment if you need
// module.exports = migrate;

// run migrations, comment next line if you export this script as module
migrate();
