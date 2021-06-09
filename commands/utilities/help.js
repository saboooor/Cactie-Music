const Discord = require('discord.js');
module.exports = {
	name: 'help',
	description: 'Get help with Pup',
	aliases: ['commands'],
	cooldown: 10,
	guildOnly: true,
	options: [{
		type: 3,
		name: 'type',
		description: 'The type of help you need',
		required: false,
		choices: [{
			name: 'features',
			value: 'features',
		},
		{
			name: 'commands',
			value: 'commands',
		},
		{
			name: 'nsfw',
			value: 'nsfw',
		},
		{
			name: 'admin',
			value: 'admin',
		},
		{
			name: 'tickets',
			value: 'tickets',
		},
		{
			name: 'supportpanel (ADMIN ONLY)',
			value: 'supportpanel',
		}],
	}],
	async execute(message, args, client) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = Array.from(args);
			args.forEach(arg => args[args.indexOf(arg)] = arg[1].value);
		}
		const prefix = await client.settings.get(message.guild.id).prefix.replace(/([^\\]|^|\*|_|`|~)(\*|_|`|~)/g, '$1\\$2');
		const Embed = new Discord.MessageEmbed()
			.setColor(Math.floor(Math.random() * 16777215))
			.setTitle('**HELP**');
		let arg = args[0];
		if (arg) arg = arg.toLowerCase();
		if (arg == 'commands') {
			require('../../help/commands.js')(prefix, Embed);
		}
		else if (arg == 'features') {
			require('../../help/features.js')(prefix, Embed);
		}
		else if (arg == 'admin') {
			require('../../help/admin.js')(prefix, Embed);
		}
		else if (arg == 'nsfw') {
			if (!message.channel.nsfw) return message.react('🔞');
			require('../../help/nsfw.js')(prefix, Embed);
		}
		else if (arg == 'tickets') {
			require('../../help/tickets.js')(prefix, Embed);
		}
		else if (arg == 'supportpanel') {
			if (!message.member.permissions.has('ADMINISTRATOR')) return;
			Embed.setDescription('Created support panel! You may now delete this message');
			const Panel = new Discord.MessageEmbed()
				.setColor(3447003)
				.setTitle('Need help? No problem!')
				.setFooter(`${message.guild.name} Support`, message.guild.iconURL());
			if (client.settings.get(message.guild.id).tickets == 'buttons') {
				Panel.setDescription('Click the button below to open a ticket!');
				const row = new Discord.MessageActionRow()
					.addComponents(
						new Discord.MessageButton()
							.setCustomID('create_ticket')
							.setLabel('Open Ticket')
							.setEmoji('🎫')
							.setStyle('PRIMARY'),
					);
				message.channel.send({ embed: Panel, components: [row] });
			}
			else if (client.settings.get(message.guild.id).tickets == 'reactions') {
				Panel.setDescription('React with 🎫 to open a ticket!');
				const msg = await message.channel.send(Panel);
				await msg.react('🎫');
			}
			else if (client.settings.get(message.guild.id).tickets == 'false') {
				return message.reply('Tickets are disabled!');
			}
		}
		else {
			Embed.setDescription('\n\nPlease use the buttons below to navigate through the help menu');
		}
		const row = new Discord.MessageActionRow()
			.addComponents([
				new Discord.MessageButton()
					.setCustomID('help_features')
					.setLabel('Features')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setCustomID('help_commands')
					.setLabel('Commands')
					.setStyle('PRIMARY'),
				new Discord.MessageButton()
					.setCustomID('help_nsfw')
					.setLabel('NSFW')
					.setStyle('DANGER'),
				new Discord.MessageButton()
					.setCustomID('help_admin')
					.setLabel('Admin')
					.setStyle('SECONDARY'),
				new Discord.MessageButton()
					.setCustomID('help_tickets')
					.setLabel('Tickets')
					.setStyle('SECONDARY')]);
		const row2 = new Discord.MessageActionRow()
			.addComponents([
				new Discord.MessageButton()
					.setURL('https://discord.gg/Bsefgbaedz')
					.setLabel('Support Discord')
					.setStyle('LINK'),
				new Discord.MessageButton()
					.setURL('https://paypal.me/youhavebeenyoted')
					.setLabel('Donate')
					.setStyle('LINK')]);
		if (message.commandName) message.reply({ embeds: [Embed], components: [row, row2], ephemeral: true });
		else message.reply({ embed: Embed, components: [row, row2] });
	},
};