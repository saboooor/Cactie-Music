const { convertTime } = require('../functions/music/convert.js');
const { createPaste } = require('hastebin');
const { music } = require('../lang/int/emoji.json');
const msg = require('../lang/en/msg.json');
module.exports = {
	name: 'queue_prev',
	player: true,
	async execute(interaction, client) {
		try {
			// Get the player, queue, and embed
			const player = interaction.client.manager.get(interaction.guild.id);
			const queue = player.queue;
			const song = queue.current;
			const QueueEmbed = interaction.message.embeds[0];

			// Calculate total amount of pages and get current page from embed footer
			const maxPages = Math.ceil(queue.length / 10);
			const lastPage = parseInt(QueueEmbed.footer.text.split(' ')[1]);

			// Get prev page (if first page, go to last page)
			const page = lastPage - 1 ? lastPage - 1 : maxPages;
			const end = page * 10;
			const start = end - 10;
			const tracks = queue.slice(start, end);

			// Clear fields, add new page to fields
			QueueEmbed.setFields();
			if (song) QueueEmbed.addFields({ name: `<:music:${music}> **${msg.music.np}**`, value: `[${song.title}](${song.uri})\n\`[${convertTime(song.duration).replace('7:12:56', 'LIVE')}]\` [${song.requester}]` });
			let mapped = tracks.map((track, i) => `**${start + (++i)}** • ${track.title} \`[${convertTime(track.duration).replace('7:12:56', 'LIVE')}]\` [${track.requester}]`).join('\n');
			if (mapped.length > 1024) mapped = `List too long, shortened to a link\n${await createPaste(mapped, { server: 'https://bin.birdflop.com' })}`;
			if (!tracks.length) QueueEmbed.addFields({ name: 'No tracks up next', value: `in ${page > 1 ? `page ${page}` : 'the queue'}.` });
			else QueueEmbed.addFields({ name: `<:music:${music}> Queue List`, value: mapped });

			// Set current page number in footer and reply
			QueueEmbed.setFooter({ text: msg.page.replace('-1', page > maxPages ? maxPages : page).replace('-2', maxPages) });
			return interaction.reply({ embeds: [QueueEmbed], components: interaction.message.components });
		}
		catch (err) {
			client.error(err, interaction);
		}
	},
};