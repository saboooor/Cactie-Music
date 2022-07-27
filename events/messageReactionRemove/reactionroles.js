module.exports = async (client, reaction, user) => {
	if (user.bot) return;
	const message = await reaction.message.fetch().catch(err => logger.error(err.stack));
	if (!message.channel || message.channel.isDMBased()) return;
	let emojiId = reaction.emoji.id;
	if (!emojiId) emojiId = reaction.emoji.name;
	const reactionrole = (await client.query(`SELECT * FROM reactionroles WHERE messageId = '${message.id}' AND emojiId = '${emojiId}'`))[0];
	if (reactionrole && reactionrole.type != 'toggle') {
		const role = message.guild.roles.cache.get(reactionrole.roleId);
		if (!role) return client.error('The role can\'t be found!', message, true);
		let member = await message.guild.members.cache.get(user.id);
		if (!member) member = await message.guild.members.fetch(user.id);
		await member.roles.remove(role);
		const RRMsg = await message.channel.send({ content: `❌ **Removed ${role.name} Role from ${user}**` });
		logger.info(`Removed ${role.name} Role from ${user.tag} in ${message.guild.name}`);
		await sleep(1000);
		await RRMsg.delete().catch(err => logger.error(err.stack));
	}
};