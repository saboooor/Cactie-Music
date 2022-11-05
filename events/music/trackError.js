const { EmbedBuilder } = require('discord.js');

module.exports = async (client, player, track, payload) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	// Get the language for the user if specified or guild language
	const lang = require('../../lang/English/msg.json');
	const FailEmbed = new EmbedBuilder()
		.setColor(0xE74C3C)
		.setDescription(`❌ **${lang.music.track.failed}**`)
		.setFooter({ text: payload.error });
	const errorMsg = await channel.send({ embeds: [FailEmbed] });
	logger.error(payload.error);
	logger.error(`Failed to load track in ${guild.name}`);
	await sleep(30000);
	errorMsg.delete().catch(err => logger.error(err));
};