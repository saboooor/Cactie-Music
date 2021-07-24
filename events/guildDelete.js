const moment = require('moment');
const Discord = require('discord.js');
module.exports = async (client, guild) => {
	client.settings.delete(guild.id);
	client.logger.info(`${client.user.username} has been removed from ${guild.name}`);
	const owner = await guild.fetchOwner();
	const Embed = new Discord.MessageEmbed()
		.setColor(Math.floor(Math.random() * 16777215))
		.setTitle(`${client.user.username} has been removed from ${guild.name}`)
		.setThumbnail(guild.iconURL())
		.setFooter(`Owner: ${owner.user.username}`, owner.user.avatarURL())
		.addField('Creation Date', `${moment(guild.createdAt)}`);
	client.channels.cache.get('865682839616618506').send({ embeds: [Embed] });
};