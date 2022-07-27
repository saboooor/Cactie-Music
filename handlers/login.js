const fs = require('fs');
const YAML = require('yaml');
const { con, clientParams } = YAML.parse(fs.readFileSync('./config.yml', 'utf8'));
module.exports = client => {
	client.login(con.token);
	logger.info('Bot logged in');
	Object.keys(clientParams).forEach(key => client[key] = clientParams[key]);
};