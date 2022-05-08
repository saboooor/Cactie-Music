const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	name: '21questions',
	description: 'Play 21 Questions with an opponent',
	aliases: ['21q'],
	args: true,
	usage: '<Opponent User>',
	cooldown: 10,
	options: require('../../options/user.js'),
	async execute(message, args, client, lang) {
		let member = await message.guild.members.cache.get(args[0].replace(/\D/g, ''));
		if (!member) member = await message.guild.members.fetch(args[0].replace(/\D/g, ''));
		if (!member) return client.error(lang.invalidmember, message, true);
		const row = new ActionRowBuilder()
			.addComponents([
				new ButtonBuilder()
					.setCustomId('choose_answer')
					.setLabel('Choose Answer')
					.setStyle(ButtonStyle.Secondary),
			]);
		const TwentyOneQuestions = new EmbedBuilder()
			.setColor(0x2f3136)
			.setTitle('21 Questions')
			.setDescription(`**Playing with:**\n${member}\n**Host:**\n${message.member}\nPlease choose an answer by clicking the button below.`)
			.setThumbnail(message.member.user.avatarURL());

		const questionmsg = await message.reply({ content: `${message.member}`, embeds: [TwentyOneQuestions], components: [row] });

		const filter = i => i.customId == 'choose_answer' && i.member.id == message.member.id;
		const collector = questionmsg.createMessageComponentCollector({ filter, time: 3600000 });

		collector.on('collect', async interaction => {
			// Create and show a modal for the user to fill out the answer
			const modal = new ModalBuilder()
				.setTitle('Choose an answer')
				.setCustomId('choose_answer')
				.addComponents([
					new ActionRowBuilder().addComponents([
						new TextInputBuilder()
							.setCustomId('answer')
							.setLabel('This will be the answer to the game')
							.setStyle(TextInputStyle.Short)
							.setMaxLength(1024),
					]),
				]);
			interaction.showModal(modal);
			collector.stop();
		});

		collector.on('end', () => {
			if (collector.collected.size == 0) questionmsg.edit({ content: 'A game of 21 Questions should not last longer than an hour are you high', components: [], embeds: [] });
		});
	},
};