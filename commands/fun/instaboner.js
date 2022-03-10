const { Embed } = require('discord.js');
module.exports = {
	name: 'instaboner',
	description: 'See your boner expand INSTANTLY!',
	voteOnly: true,
	usage: '[Someone]',
	aliases: ['instapp'],
	options: require('../options/someone.json'),
	async execute(message, args, client) {
		try {
			// Get settings and check if bonercmd is enabled
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.bonercmd == 'false') return client.error('This command is disabled!', message, true);

			// Get name of author, or user if specified
			const name = message.member.displayName;
			let nick = args[0] ? args[0] : name;

			// Check if arg is set and is a mention and fetch that user for the name
			if (args[0] && nick.startsWith('<@') && nick.endsWith('>')) {
				const mention = nick.replace(/\D/g, '');
				nick = client.users.cache.get(mention).username;
			}

			// Randomly pick between hard or soft
			const hard = Math.round(Math.random());
			const hardtxt = hard == 1 ? 'soft' : 'hard';

			// Create initial embed
			const ppEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle(`${nick}'s ${hardtxt} pp size`);

			// Chance of getting a SIKE u have no pp
			if (Math.round(Math.random() * 10) == 5) {
				ppEmbed.setDescription('SIKE').setFooter({ text: `${nick} has no pp` });
				return message.reply({ embeds: [ppEmbed] });
			}

			// Get random number out of the maxppsize for the amount of inches and set the description and footer to size then reply
			const random = Math.round(Math.random() * srvconfig.maxppsize);
			ppEmbed.setDescription('8' + '='.repeat(random - 1 == -1 ? 0 : random - 1) + 'D').setFooter({ text: `${hardtxt} pp size = ${random}"` });
			message.reply({ embeds: [ppEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};