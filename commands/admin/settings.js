function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { left, right } = require('../../lang/int/emoji.json');
const fs = require('fs');
const languages = fs.readdirSync('./lang').filter(folder => folder != 'int');
const settingoptions = require('../options/settings.json');
languages.forEach(language => settingoptions[3].options[0].choices.push({ name: language, value: language }));
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = {
	name: 'settings',
	description: 'Configure Cactie\'s settings in the server',
	aliases: ['setting'],
	usage: '[<Setting> <Value>]',
	permission: 'Administrator',
	options: settingoptions,
	async execute(message, args, client) {
		try {
			// Get the settings descriptions
			const desc = require(`../../lang/${message.lang.language}/settingsdesc.json`);

			// Create Embed with title and color
			const SettingsEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setTitle('Bot Settings');
			const components = []; let configlist = null;
			// Lowercase first arg
			if (args[0]) args[0] = args[0].toLowerCase();
			// Check if arg is set or is 'reset'
			if (args[1] != null && args[0] != 'reset') {
				// Set prop variable to first argument
				const prop = args[0];

				// Check if setting exists
				const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
				if (!srvconfig[prop]) return client.error('Invalid setting!', message, true);
				// Set value to second argument for slash commands and the rest of the text joined for normal commands
				const value = message.commandName ? args[1].toString() : args.join(' ').replace(`${args[0]} `, '');

				// Avoid users from setting guildId
				if (prop == 'guildid') return client.error('You can\'t change that!', message, true);
				// Check if language is one of the languages in the lang folder
				if (prop == 'language') {
					const lang = capitalizeFirstLetter(value.toLowerCase());
					if (!languages.includes(lang)) return message.reply({ content: `**Invalid Language**\nPlease use a language from the list below:\`\`\`yml\n${languages.join(', ')}\`\`\`` });
				}
				// Tickets setting can only be either buttons, reactions, or false
				if (prop == 'tickets' && value != 'buttons' && value != 'reactions' && value != 'false') return client.error('This setting must be either "buttons", "reactions", or "false"!', message, true);
				// Reactions / Bonercmd / Suggestthreads settings can only either be true or false
				if ((prop == 'reactions' || prop == 'bonercmd' || prop == 'suggestthreads') && value != 'true' && value != 'false') return client.error('This setting must be either "true", or "false"!', message, true);
				// Leavemessage / Joinmessage can only be enabled if the systemChannel is set (may change later to a separate setting)
				if ((prop == 'leavemessage' || prop == 'joinmessage') && !message.guild.systemChannel && value != 'false') return client.error(`Please set a system channel in ${message.guild.name} settings first!`, message, true);
				// Suggestionchannel / Pollchannel / Logchannel can only be a text channel or false
				if ((prop == 'suggestionchannel' || prop == 'pollchannel' || prop == 'logchannel') && value != 'false' && (!message.guild.channels.cache.get(value) || !message.guild.channels.cache.get(value).isText())) return client.error('That\'s not a valid text channel Id!', message, true);
				// Ticketcategory can only be a category channel or false
				if (prop == 'ticketcategory' && value != 'false' && (!message.guild.channels.cache.get(value) || !message.guild.channels.cache.get(value).isCategory())) return client.error('That\'s not a valid category Id!', message, true);
				// Supportrole / Djrole can only be a role
				if ((prop == 'supportrole' || prop == 'djrole') && value != 'false' && !message.guild.roles.cache.get(value)) return client.error('That\'s not a valid role Id!', message, true);
				// Adminrole can only be a role or 'permission'
				if ((prop == 'adminrole') && value != 'permission' && !message.guild.roles.cache.get(value)) return client.error('That\'s not a valid role Id!', message, true);
				// Msgshortener can only be a number
				if ((prop == 'msgshortener' || prop == 'maxppsize') && isNaN(value)) return client.error('That\'s not a valid number!', message, true);
				// Maxppsize can only be less than 76
				if (prop == 'maxppsize' && value > 76) return client.error('"maxppsize" must be 75 or less!', message, true);
				// Ticketmention can only be here, everyone, or a valid role
				if ((prop == 'ticketmention') && value != 'everyone' && value != 'here' && value != 'false' && !message.guild.roles.cache.get(value)) return client.error('This setting must be either "here", "everyone", or a valid role Id!', message, true);
				// Set mutecmd's permissions
				if (prop == 'mutecmd' && value != 'timeout' && value != 'false') {
				// Check if valid role if not false
					const role = message.guild.roles.cache.get(value);
					if (!role) { return client.error('That is not a valid role Id!', message, true); }
					else {
						message.guild.channels.cache.forEach(channel => {
							channel.permissionOverwrites.edit(role, { SendMessages: false })
								.catch(err => client.logger.error(err));
						});

						// Move the mute role under pup's highest role if not already over it
						const rolepos = message.guild.members.cache.get(client.user.id).roles.highest.rawPosition;
						if (rolepos > role.rawPosition) role.setPosition(rolepos - 1);
					}
				}
				// Set the setting and the embed description / log
				await client.setData('settings', 'guildId', message.guild.id, prop, value);
				SettingsEmbed.setDescription(`Successfully set \`${prop}\` to \`${value}\``);
				client.logger.info(`Successfully set ${prop} to ${value} in ${message.guild.name}`);

				// Check if log channel exists and send message
				const logchannel = message.guild.channels.cache.get(srvconfig.logchannel);
				if (logchannel) {
					const logEmbed = new EmbedBuilder()
						.setAuthor({ name: `${message.member.user.tag} changed a setting`, iconURL: message.member.user.avatarURL() })
						.addFields({ name: 'Setting', value: prop })
						.addFields({ name: 'Value', value: value });
					logchannel.send({ embeds: [logEmbed] });
				}
			}
			else if (args[0] == 'reset') {
				// Set title to 'SETTINGS RESET'
				SettingsEmbed.setTitle('**SETTINGS RESET**')
					.setDescription('Do you want to reset all settings to their default values?')
					.setFooter({ text: 'You only have 30 seconds to respond.' });

				// Add buttons for reset confirm / deny
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('settings_reset')
							.setLabel('Reset Settings')
							.setStyle(ButtonStyle.Danger),
					)
					.addComponents(
						new ButtonBuilder()
							.setCustomId('settings_nevermind')
							.setLabel('Nevermind')
							.setStyle(ButtonStyle.Primary),
					);
				components.push(row);
			}
			else {
				// Get settings and make an array out of it to split and make pages
				const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
				configlist = Object.keys(srvconfig).map(prop => {
					return `**${prop}**\n${desc[prop]}\n\`${srvconfig[prop]}\``;
				});
				const maxPages = Math.ceil(configlist.length / 5);

				// Set embed description with page and stuff
				SettingsEmbed.setDescription(configlist.slice(0, 4).join('\n'))
					.addFields({ name: 'Usage', value: '`/settings [<Setting> <Value>]`' })
					.setFooter({ text: message.lang.page.replace('-1', '1').replace('-2', maxPages) });
				if (client.user.id == '848775888673439745') SettingsEmbed.addFields({ name: message.lang.dashboard.confusing, value: message.lang.dashboard.use });

				// Add buttons for page changing
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('settings_page_prev')
							.setEmoji({ id: left })
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setCustomId('settings_page_next')
							.setEmoji({ id: right })
							.setStyle(ButtonStyle.Secondary),
						new ButtonBuilder()
							.setURL('https://cactie.smhsmh.club')
							.setLabel(message.lang.dashboard.name)
							.setStyle(ButtonStyle.Link),
					);
				components.push(row);
			}

			// If there aren't any buttons, add a button for dashboard
			if (!components[0]) {
				const row = new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setURL('https://cactie.smhsmh.club')
							.setLabel(message.lang.dashboard.name)
							.setStyle(ButtonStyle.Link),
					);
				components.push(row);
			}

			// Send Embed with buttons
			const SettingsMsg = await message.reply({ embeds: [SettingsEmbed], components: components });

			if (args[0] == 'reset' || !args[1]) {
				const collector = SettingsMsg.createMessageComponentCollector({ time: args[0] == 'reset' ? 30000 : 120000 });
				collector.on('collect', async interaction => {
					// Check if the button is one of the settings buttons
					if (!interaction.customId.startsWith('settings_')) return;
					interaction.deferUpdate();

					const button = interaction.component.customId.split('_');

					// Check if button is confirm reset or nevermind
					if (button[1] == 'reset') {
						// Delete settings database for guild and reply
						client.delData('settings', 'guildId', interaction.guild.id);
						SettingsEmbed.setDescription('Settings successfully reset!');
						SettingsMsg.edit({ components: [], embeds: [SettingsEmbed] });

						// Delete message after 5 seconds
						await sleep(5000);
						await collector.stop();
					}
					else if (button[1] == 'nevermind') {
						// Delete message and command message
						await collector.stop();
					}
					else if (button[1] == 'page') {
						// Calculate total amount of pages and get current page from embed footer
						const maxPages = Math.ceil(configlist.length / 5);
						const lastPage = parseInt(SettingsEmbed.toJSON().footer ? SettingsEmbed.toJSON().footer.text.split(' ')[1] : maxPages);

						// Get next page (if last page, go to pg 1)
						// Or get prev page (if first page, go to last page)
						const next = lastPage + 1 == maxPages + 1 ? 1 : lastPage + 1;
						const prev = lastPage - 1 ? lastPage - 1 : maxPages;
						const page = button[2] == 'prev' ? prev : next;
						const end = page * 5;
						const start = end - 5;

						// Update embed description with new page and reply
						SettingsEmbed.setDescription(configlist.slice(start, end).join('\n'))
							.setFooter({ text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}` });
						SettingsMsg.edit({ embeds: [SettingsEmbed] });
					}
				});

				// When the collector stops, remove the undo button from it
				collector.on('end', () => {
					SettingsMsg.delete();
					if (!message.commandName) message.delete();
				});
			}
		}
		catch (err) { client.error(err, message); }
	},
};