module.exports = {
	name: 'nsfw',
	description: 'nsfw',
	cooldown: 1,
	async execute(message, args, client) {
		require('../other/redditfetch_noslash.js')('nsfw', message, client);
	},
};