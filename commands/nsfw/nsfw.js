module.exports = {
	name: 'nsfw',
	description: 'NSFW commands',
	args: true,
	usage: '<NSFW category (in /help nsfw)>',
	options: require('../../options/nsfw.js'),
	execute(message, args, client, lang) {
		try { client.commands.get(args[0]).execute(message, args, client, lang); }
		catch (err) { client.error(err, message); }
	},
};