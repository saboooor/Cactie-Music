const redditFetch = require('../../functions/redditFetch.js');

module.exports = {
	name: 'dick',
	aliases: ['dicks', 'cock', 'cocks', 'penis'],
	description: 'r/dicks, r/DickPics4Freedom, r/penis, r/ThickDick, r/cock',
	async execute(message, args, client) {
		try {
			redditFetch(['dicks', 'DickPics4Freedom', 'penis', 'ThickDick', 'cock'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};