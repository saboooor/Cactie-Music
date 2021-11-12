module.exports = {
	name: 'coinflip',
	description: 'Pick between Heads or Tails?',
	aliases: ['cf'],
	async execute(message) {
		// Randomly pick between heads or tails
		const number = Math.round(Math.random());
		const text = number == 1 ? 'Head' : 'Tail';

		// Reply with result
		message.reply({ content: `<a:coinflip:908779062644867123> **${text}s!**` });
	},
};