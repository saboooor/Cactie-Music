const { Embed } = require('discord.js');
const { join } = require('../../lang/int/emoji.json');
module.exports = {
	name: 'join',
	description: 'Join voice channel',
	aliases: ['j'],
	cooldown: 2,
	inVoiceChannel: true,
	async execute(message, args, client) {
		try {
			// Get the voice channel the user is in
			const { channel } = message.member.voice;

			// Create player in that voice channel and connect to voice
			const player = client.manager.create({
				guild: message.guild.id,
				voiceChannel: channel.id,
				textChannel: message.channel.id,
				volume: 50,
				selfDeafen: true,
			});
			player.connect();

			// Send message to channel
			const JoinEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`<:in:${join}> **Joined ${channel}**`);
			message.reply({ embeds: [JoinEmbed] });
		}
		catch (err) { client.error(err, message); }
	},
};