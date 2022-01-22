const { filter } = require('../config/emoji.json');
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }
module.exports = {
	name: 'filter_bass',
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	async execute(interaction, client) {
		const player = client.manager.get(interaction.guild.id);
		await player.clearEQ();
		await sleep(30);
		const bands = [
			{ band: 0, gain: 0.6 },
			{ band: 1, gain: 0.7 },
			{ band: 2, gain: 0.8 },
			{ band: 3, gain: 0.55 },
			{ band: 4, gain: 0.25 },
			{ band: 5, gain: 0 },
			{ band: 6, gain: -0.25 },
			{ band: 7, gain: -0.45 },
			{ band: 8, gain: -0.55 },
			{ band: 9, gain: -0.7 },
			{ band: 10, gain: -0.3 },
			{ band: 11, gain: -0.25 },
			{ band: 12, gain: 0 },
			{ band: 13, gain: 0 },
			{ band: 14, gain: 0 },
		];
		await player.setEQ(...bands);
		const embed = interaction.message.embeds[0].setDescription(`${filter} Equalizer mode is now set to **Bass**.`);
		await interaction.reply({ embeds: [embed], components: interaction.message.components });
	},
};