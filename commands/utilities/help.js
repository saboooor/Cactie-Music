const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Get help with Cactie',
	aliases: ['commands'],
	usage: '[Type]',
	cooldown: 10,
	options: require('../../options/help.js'),
	async execute(message, args, client, lang) {
		try {
			const helpdesc = require(`../../lang/${lang.language.name}/helpdesc.json`);
			let HelpEmbed = new EmbedBuilder()
				.setColor('Random')
				.setTitle('**HELP**');
			let arg = args[0];
			if (arg) arg = arg.toLowerCase();
			if (arg == 'nsfw' && !message.channel.nsfw) return client.error('This channel is not NSFW. Please do this again in the appropriate channel.', message, true);
			if (arg == 'music' || arg == 'nsfw' || arg == 'utilities') {
				const category = helpdesc[arg.toLowerCase()];
				const commands = client.commands.filter(c => c.category == arg.toLowerCase());
				const array = [];
				commands.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.voteOnly ? ' <:vote:973735241619484723>' : ''}${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases.join(', ')}*` : ''}${c.permission ? `\n*Permissions: ${c.permissions.join(', ')}*` : ''}`); });
				HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
				if (category.footer) HelpEmbed.setFooter({ text: category.footer });
				if (category.field) HelpEmbed.setFields([category.field]);
			}
			else {
				HelpEmbed.setDescription('Please use the dropdown below to navigate through the help menu\n\n**Options:**\nMusic, Utilities');
			}
			const options = [];
			const categories = Object.keys(helpdesc);
			categories.forEach(category => {
				if (category == 'supportpanel') return;
				options.push(
					new SelectMenuOptionBuilder()
						.setLabel(helpdesc[category].name)
						.setDescription(helpdesc[category].description)
						.setValue(`help_${category}`)
						.setDefault(arg == category),
				);
			});
			const row = new ActionRowBuilder()
				.addComponents([
					new SelectMenuBuilder()
						.setCustomId('help_menu')
						.setPlaceholder('Select a help category!')
						.addOptions(options),
				]);
			const row2 = new ActionRowBuilder()
				.addComponents([
					new ButtonBuilder()
						.setURL('https://canary.smhsmh.club/discord')
						.setLabel('Support Discord')
						.setStyle(ButtonStyle.Link),
					new ButtonBuilder()
						.setURL('https://paypal.me/youhavebeenyoted')
						.setLabel('Donate')
						.setStyle(ButtonStyle.Link),
				]);
			const helpMsg = await message.reply({ embeds: [HelpEmbed], components: [row, row2] });

			const filter = i => i.customId == 'help_menu';
			const collector = helpMsg.createMessageComponentCollector({ filter, time: 3600000 });
			collector.on('collect', async interaction => {
				await interaction.deferUpdate();
				HelpEmbed = new EmbedBuilder()
					.setColor('Random')
					.setTitle('**HELP**');
				if (interaction.values[0] == 'help_nsfw' && !helpMsg.channel.nsfw) { HelpEmbed.setDescription('**NSFW commands are only available in NSFW channels.**\nThis is not an NSFW channel!'); }
				else {
					const category = helpdesc[interaction.values[0].split('_')[1]];
					const commands = client.commands.filter(c => c.category == interaction.values[0].split('_')[1]);
					const array = [];
					commands.forEach(c => { array.push(`**${c.name}${c.usage ? ` ${c.usage}` : ''}**${c.voteOnly ? ' <:vote:973735241619484723>' : ''}${c.description ? `\n${c.description}` : ''}${c.aliases ? `\n*Aliases: ${c.aliases.join(', ')}*` : ''}${c.permission ? `\nPermissions: ${c.permissions.join(', ')}` : ''}`); });
					HelpEmbed.setDescription(`**${category.name.toUpperCase()}**\n${category.description}\n[] = Optional\n<> = Required\n\n${array.join('\n')}`);
					if (category.footer) HelpEmbed.setFooter({ text: category.footer });
					if (category.field) HelpEmbed.setFields([category.field]);
				}
				row.components[0].options.forEach(option => option.setDefault(option.toJSON().value == interaction.values[0]));
				interaction.editReply({ embeds: [HelpEmbed], components: [row, row2] });
			});

			collector.on('end', () => {
				HelpEmbed.setDescription('Help command timed out.')
					.setFooter({ text: 'please do the help command again if you still need a list of commands.' });
				if (message.commandName) message.editReply({ embeds: [HelpEmbed], components: [row2] }).catch(err => logger.warn(err));
				else helpMsg.edit({ embeds: [HelpEmbed], components: [row2] }).catch(err => logger.warn(err));
			});
		}
		catch (err) { client.error(err, message); }
	},
};
