const fetch = require('node-fetch');
const Discord = require('discord.js');
module.exports = async (subreddit, message) => {
	const json = await fetch(`https://www.reddit.com/r/${subreddit}/random.json`);
	const pong = await json.json();
	if (pong.message == 'Not Found') return message.reply('Invalid subreddit!');
	const Embed = new Discord.MessageEmbed()
		.setAuthor(`u/${pong[0].data.children[0].data.author}`)
		.setTitle(`${pong[0].data.children[0].data.title} (${pong[0].data.children[0].data.ups} Upvotes)`)
		.setURL(`https://reddit.com${pong[0].data.children[0].data.permalink}`)
		.setDescription(pong[0].data.children[0].data.selftext)
		.setImage(pong[0].data.children[0].data.url)
		.setFooter(`Fetched from r/${pong[0].data.children[0].data.subreddit}, Pup is not responsible for any of these posts`);
	if (!message.channel.nsfw && pong[0].data.children[0].data.over_18) return message.react('🔞');
	await message.reply(Embed);
};