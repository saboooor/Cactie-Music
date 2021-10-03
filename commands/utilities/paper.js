const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
module.exports = {
	name: 'paper',
	description: 'Get info on the latest Paper build',
	usage: '[Version] [Build]',
	options: [{
		type: 3,
		name: 'version',
		description: 'Specify a Minecraft version',
	},
	{
		type: 3,
		name: 'build',
		description: 'Specify a Paper build number',
	}],
	async execute(message, args) {
		if (message.type && message.type == 'APPLICATION_COMMAND') {
			args = args._hoistedOptions;
			args.forEach(arg => args[args.indexOf(arg)] = arg.value);
		}
		// fetch the latest mc version
		const a = await fetch('https://papermc.io/api/v2/projects/paper');
		const b = await a.json();
		// if specified args are valid then replace latest with that number
		const c = args[0] ? args[0] : b.versions[b.versions.length - 1];
		// fetch the latest build for mc version specified or latest
		const d = await fetch(`https://papermc.io/api/v2/projects/paper/versions/${c}`);
		const e = await d.json();
		const build = e.builds[e.builds.length - 1];
		// fetc the build specified
		const f = args[1] ? args[1] : build;
		const g = await fetch(`https://papermc.io/api/v2/projects/paper/versions/${c}/builds/${f}`);
		const h = await g.json();
		// check if error
		if (h.error) return message.reply(h.error);
		// initial embed creation
		const Embed = new MessageEmbed()
			.setColor(16777215)
			.setTitle(`Paper ${h.version} build ${h.build}`)
			.setURL(`https://papermc.io/api/v2/projects/paper/versions/${c}/builds/${f}`)
			.setThumbnail('https://avatars.githubusercontent.com/u/7608950?s=200&v=4')
			.setDescription(`${h.changes.length} commit(s)`)
			.setTimestamp(Date.parse(h.time));
		// add fields for commits
		h.changes.forEach(commit => {
			// check if commit description is more than 1000, if so, split it into multiple fields
			if (commit.message.length > 1000) commit.message.match(/[\s\S]{1,1000}/g).forEach(chunk => { Embed.addField(commit.commit, `${chunk}`); });
			else Embed.addField(commit.commit, commit.message);
		});
		// add field for download
		Embed.addField('Download', `[Click Here](https://papermc.io/api/v2/projects/paper/versions/${c}/builds/${f}/downloads/${h.downloads.application.name})`);
		// send embed
		message.reply({ embeds: [Embed] });
	},
};