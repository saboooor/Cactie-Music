const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const msg = require('../../../lang/English/msg.json');
module.exports = async (client, guild) => {
	const srvconfig = await client.getData('settings', 'guildId', guild.id);
	const row = new ActionRowBuilder()
		.addComponents([
			new ButtonBuilder()
				.setURL('https://cactie.smhsmh.club')
				.setLabel(msg.dashboard.name)
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setURL('https://cactie.smhsmh.club/support/discord')
				.setLabel('Support Server')
				.setStyle(ButtonStyle.Link),
			new ButtonBuilder()
				.setURL('https://top.gg/bot/765287593762881616')
				.setLabel('Vote on top.gg')
				.setStyle(ButtonStyle.Link),
		]);
	const greetingEmbed = new EmbedBuilder()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`Thanks for adding ${client.user.username} to ${guild.name}!`)
		.setDescription(`
My text command prefix is \`${srvconfig.prefix}\`, you may change this through the settings with \`/settings\`
Type \`/help\` for help, and \`/invite\` to invite me to other servers!
Please take some time going through the settings so that ${client.user.username} works well! \`/settings\`
		`)
		.setThumbnail('https://cactie.smhsmh.club/assets/images/Cactie.png');
	const message = { embeds: [greetingEmbed], components: [row] };
	const owner = await guild.fetchOwner();
	if (!guild.systemChannel) owner.send(message).catch(err => client.logger.warn(err));
	else guild.systemChannel.send(message).catch(err => client.logger.warn(err));
};