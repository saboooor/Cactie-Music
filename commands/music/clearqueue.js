const { EmbedBuilder } = require('discord.js');
const { no } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'clearqueue',
	description: 'Clear Queue',
	aliases: ['cq'],
	cooldown: 5,
	player: true,
	invc: true,
	samevc: true,
	async execute(message, args, client) {
		try {
			// Get player
			const player = client.manager.get(message.guild.id);

			// Check if djrole is set, if so, check if user has djrole, if not, vote for queue clear instead of clearing queue
			const srvconfig = await client.getData('settings', 'guildId', message.guild.id);
			if (srvconfig.djrole != 'false' && message.guild.roles.cache.get(srvconfig.djrole) && !message.member.roles.cache.has(srvconfig.djrole)) {
				const requiredAmount = Math.floor((message.guild.me.voice.channel.members.size - 1) / 2);
				if (!player.clearQueueAmount) player.clearQueueAmount = [];
				let alr = false;
				for (const i of player.clearQueueAmount) { if (i == message.member.id) alr = true; }
				if (alr) return client.error(message.lang.music.queue.clearalr, message, true);
				player.clearQueueAmount.push(message.member.id);
				if (player.clearQueueAmount.length < requiredAmount) return message.reply({ content: `**${message.lang.music.queue.clearing}** \`${player.clearQueueAmount.length} / ${requiredAmount}\`` });
				player.clearQueueAmount = null;
			}

			// Clear the queue and send message
			player.queue.clear();
			const ClearEmbed = new EmbedBuilder()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:no:${no}> **${message.lang.music.queue.cleared}**`)
				.setFooter({ text: message.member.user.tag, iconURL: message.member.user.displayAvatarURL() });
			message.reply({ embeds: [ClearEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};