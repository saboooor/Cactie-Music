const { EmbedBuilder } = require('discord.js');
const { pause, play } = require('../../lang/int/emoji.json');

module.exports = async (client, oldState, newState) => {
	// Check if the mute state actually changed
	if (oldState.selfDeaf == newState.selfDeaf && oldState.serverDeaf == newState.serverDeaf) return;

	// get guild and player
	const guild = newState.guild;
	const player = client.manager.get(guild.id);
	if (!player || player.state !== 'CONNECTED' || (player.voiceChannel != oldState.channelId && player.voiceChannel != newState.channelId)) return;
	const textChannel = guild.channels.cache.get(player.textChannel);
	const voiceChannel = guild.channels.cache.get(player.voiceChannel);
	const song = player.queue.current;
	if (!song) return;

	// Get the language for the user if specified or guild language
	const lang = require('../../lang/English/msg.json');

	// Chcck if player should be paused or not or the event should be ignored
	let playerpause;
	const members = voiceChannel.members.filter(member => !member.user.bot);
	const deafened = members.filter(member => member.voice.selfDeaf || member.voice.serverDeaf);
	if (deafened.size == members.size) playerpause = true;
	else if (deafened.size == members.size - 1) playerpause = false;
	else return;

	// Pause and log
	player.pause(playerpause);
	logger.info(playerpause ? `Paused player in ${guild.name} because of all deafened` : `Resumed player in ${guild.name} because of undeafen`);

	// Create pause embed
	const PauseEmbed = new EmbedBuilder()
		.setDescription(`<:pause:${pause}> **${lang.music.pause.ed}**\n[${song.title}](${song.uri})`)
		.setColor(song.colors[0])
		.setThumbnail(song.img)
		.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.deafened}` });
	const ResumeEmbed = new EmbedBuilder()
		.setDescription(`<:play:${play}> **${lang.music.pause.un}**\n[${song.title}](${song.uri})`)
		.setColor(song.colors[0])
		.setThumbnail(song.img)
		.setFooter({ text: `${lang.music.vcupdate.reason}: ${lang.music.vcupdate.undeafened}` });

	// Send embed as now playing message
	if (player.nowPlayingMessage) player.nowPlayingMessage.edit({ embeds: [playerpause ? PauseEmbed : ResumeEmbed] }).catch(err => logger.warn(err));
	else textChannel.send({ embeds: [playerpause ? PauseEmbed : ResumeEmbed] });

	// Set the player timeout
	return player.timeout = playerpause ? Date.now() + 300000 : null;
};