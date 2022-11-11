const { SlashCommandSubcommandBuilder } = require('discord.js');
const { readdirSync } = require('fs');
const truncateString = (string, maxLength) =>
	string.length > maxLength
		? `${string.substring(0, maxLength)}…`
		: string;

module.exports = async function options(cmd) {
	const commands = readdirSync('./commands/nsfw');
	commands.forEach(commandName => {
		cmd.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName(commandName.replace('.js', ''))
				.setDescription(truncateString(require(`../commands/nsfw/${commandName}`).description, 99)),
		);
	});
};