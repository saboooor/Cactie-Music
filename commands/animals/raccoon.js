const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'raccoon',
	description: 'yes meerkat',
	aliases: ['raccoons'],
	async execute(message, args, client) {
		try {
			// Get from r/Raccoons with the redditFetch function
			redditFetch(['Raccoons', 'raccoonfanclub', 'trashpandas'], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};