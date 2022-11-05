const { warn } = require('../../lang/int/emoji.json');
const { EmbedBuilder } = require('discord.js');

module.exports = async (client, player) => {
	const guild = client.guilds.cache.get(player.guild);
	const channel = guild.channels.cache.get(player.textChannel);
	const lang = require('../../lang/English/msg.json');
	const EndEmbed = new EmbedBuilder()
		.setColor('Random')
		.setDescription(`<:alert:${warn}> **${lang.music.ended}**`);
	const NowPlaying = await channel.send({ embeds: [EndEmbed] });
	player.setNowplayingMessage(NowPlaying);
	logger.info(`Queue ended in ${guild.name}`);
	player.timeout = Date.now() + 300000;
};