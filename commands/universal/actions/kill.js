const action = require('../../../functions/action.js');
module.exports = {
	name: 'kill',
	description: 'Kill someone!',
	usage: '<Someone>',
	args: true,
	options: require('../../discordcmds/options/someonereq.js'),
	async execute(message, args, client) {
		try {
			action(message, args, 'kill', 'kills', 'u die lol 🔫');
		}
		catch (err) { client.error(err, message); }
	},
};