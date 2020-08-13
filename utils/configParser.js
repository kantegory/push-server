const ini = require('ini');
const fs = require('fs');

const configParser = (path, moduleName) => {
  let configFile = fs.readFileSync(path, 'utf-8');
  let parsedConfig = ini.parse(configFile)[moduleName];

  return parsedConfig;
}

module.exports = configParser;
