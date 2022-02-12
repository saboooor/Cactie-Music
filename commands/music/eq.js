const { Embed, ButtonComponent, ActionRow } = require('discord.js');
const msg = require('../../lang/en/msg.json');
module.exports = {
	name: 'eq',
	description: 'Set Equalizer',
	voteOnly: true,
	aliases: [ 'filter', 'equalizer' ],
	cooldown: 10,
	player: true,
	serverUnmute: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Add embed and buttons to message and send, the eq will be set in the buttons or dashboard
			const EQEmbed = new Embed()
				.setColor(Math.round(Math.random() * 16777215))
				.setTitle(msg.music.eq.name)
				.setDescription(msg.music.eq.choose)
				.addField(msg.music.eq.precise, `[${msg.dashboard}](https://pup.smhsmh.club/music)`);
			const but = new ButtonComponent().setCustomId('filter_clear').setLabel(msg.off).setStyle('DANGER');
			const but2 = new ButtonComponent().setCustomId('filter_bass').setLabel(msg.music.eq.bass).setStyle('PRIMARY');
			const but3 = new ButtonComponent().setCustomId('filter_party').setLabel(msg.music.eq.party).setStyle('PRIMARY');
			const but4 = new ButtonComponent().setCustomId('filter_radio').setLabel(msg.music.eq.radio).setStyle('PRIMARY');
			const but5 = new ButtonComponent().setCustomId('filter_pop').setLabel(msg.music.eq.pop).setStyle('PRIMARY');
			const but6 = new ButtonComponent().setCustomId('filter_treb').setLabel(msg.music.eq.treb).setStyle('PRIMARY');
			const but7 = new ButtonComponent().setCustomId('filter_boost').setLabel(msg.music.eq.boost).setStyle('PRIMARY');
			const but8 = new ButtonComponent().setCustomId('filter_soft').setLabel(msg.music.eq.soft).setStyle('PRIMARY');
			const but9 = new ButtonComponent().setCustomId('filter_maxed').setLabel(msg.music.eq.maxed).setStyle('PRIMARY');
			const row = new ActionRow().addComponents(but, but2, but3, but4, but5);
			const row2 = new ActionRow().addComponents(but6, but7, but8, but9);
			await message.reply({ embeds: [EQEmbed], components: [row, row2] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};