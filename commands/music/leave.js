const { Embed } = require('discord.js');
module.exports = {
	name: 'leave',
	description: 'Leave voice channel',
	aliases: ['dc', 'fuckoff'],
	cooldown: 2,
	player: true,
	inVoiceChannel: true,
	sameVoiceChannel: true,
	djRole: true,
	async execute(message, args, client) {
		try {
			// Get the player and destroy it
			const player = client.manager.get(message.guild.id);
			player.destroy();

			// Send message to channel
			const LeaveEmbed = new Embed()
				.setColor(Math.floor(Math.random() * 16777215))
				.setDescription(`📤 **Left VC**\nThank you for using ${client.user.username}!`);
			return message.reply({ embeds: [LeaveEmbed] });
		}
		catch (err) {
			client.error(err, message);
		}
	},
};