const { EmbedBuilder } = require('discord.js');
const compressEmbed = require('../../functions/compressEmbed');
const { no } = require('../../lang/int/emoji.json');

module.exports = {
	name: 'removesong',
	description: 'Remove a song from the queue',
	aliases: ['remsong', 'rm'],
	args: true,
	usage: '<Index of song in queue>',
	player: true,
	invc: true,
	samevc: true,
	djRole: true,
	options: require('../../options/index.js'),
	async execute(message, args, client, lang) {
		try {
			// Get player and index from arg and check if index exists
			const player = client.manager.get(message.guild.id);
			const position = Number(args[0]) - 1;
			if (isNaN(position) || position > player.queue.size) {
				const number = isNaN(position) ? args[0] : position + 1;
				return client.error(`${lang.music.queue.indexnotfound.replace('{index}', number)}\nTotal Songs: ${player.queue.size}`, message, true);
			}

			// Get song from index and remove it and reply
			const song = player.queue[position];
			player.queue.remove(position);
			const RemEmbed = new EmbedBuilder()
				.setDescription(`<:no:${no}> **Removed**\n[${song.title}](${song.uri})`)
				.setColor(song.colors[0])
				.setThumbnail(song.img);
			const remmsg = await message.reply({ embeds: [RemEmbed] });

			// Wait 10 seconds and compress the message
			await sleep(10000);
			if (message.commandName) message.editReply({ embeds: [compressEmbed(RemEmbed)] }).catch(err => logger.warn(err));
			else remmsg.edit({ embeds: [compressEmbed(RemEmbed)] }).catch(err => logger.warn(err));
		}
		catch (err) { client.error(err, message); }
	},
};