const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
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
	async execute(message) {
		// Add embed and buttons to message and send, the eq will be set in the buttons or dashboard
		const embed = new MessageEmbed()
			.setColor(Math.round(Math.random() * 16777215))
			.setTitle('Equalizer')
			.setDescription('Choose a mode to set the equalizer to.')
			.addField('Want a more precise equalizer?', '[Use the dashboard!](https://pup.smhsmh.club/music)');
		const but = new MessageButton().setCustomId('filter_clear').setLabel('Clear').setStyle('DANGER');
		const but2 = new MessageButton().setCustomId('filter_bass').setLabel('Bass').setStyle('PRIMARY');
		const but3 = new MessageButton().setCustomId('filter_party').setLabel('Party').setStyle('PRIMARY');
		const but4 = new MessageButton().setCustomId('filter_radio').setLabel('Radio').setStyle('PRIMARY');
		const but5 = new MessageButton().setCustomId('filter_pop').setLabel('Pop').setStyle('PRIMARY');
		const but6 = new MessageButton().setCustomId('filter_treb').setLabel('Treblebass').setStyle('PRIMARY');
		const but7 = new MessageButton().setCustomId('filter_boost').setLabel('Boost').setStyle('PRIMARY');
		const but8 = new MessageButton().setCustomId('filter_soft').setLabel('Soft').setStyle('PRIMARY');
		const but9 = new MessageButton().setCustomId('filter_maxed').setLabel('Maxed').setStyle('PRIMARY');
		const row = new MessageActionRow().addComponents(but, but2, but3, but4, but5);
		const row2 = new MessageActionRow().addComponents(but6, but7, but8, but9);
		await message.reply({ embeds: [embed], components: [row, row2] });
	},
};