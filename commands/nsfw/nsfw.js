const redditFetch = require('../../functions/redditFetch.js');
module.exports = {
	name: 'nsfw',
	async execute(message, args, client) {
		try {
			redditFetch([
				'nsfw',
				'dicks',
				'DickPics4Freedom',
				'penis',
				'ThickDick',
				'femdom',
				'FemdomHumiliation',
				'femdomgonewild',
				'furryporn',
				'FurryPornSubreddit',
				'yiff',
				'futanari',
				'cutefutanari',
				'traphentai',
				'hentai',
				'hentaifemdom',
				'lesbians',
				'Lesbian_gifs',
				'lewd',
				'hololewd',
				'nudes',
				'oppai',
				'pussy',
				'rule34',
				'tits',
				'traps',
				'yuri',
				'PetiteGoneWild',
				'RealGirls',
				'Nude_Selfie',
				'HENTAI_GIF',
				'oppai_gif',
				'pussyrating',
				'shavedpussies',
				'grool',
				'Rule_34',
				'Rule34LoL',
				'Overwatch_Porn',
				'OverwatchNSFW',
				'juicyasians',
				'TittyDrop',
				'trapsarentgay',
				'FemBoys',
				'yurigif',
				'Thighs',
				'ThickThighs',
				'thick',
				'thighdeology',
				'Pegging',
				'femdom_gifs',
				'FutanariPegging',
				'FutanariGifs',
				'gonewild',
				'GodPussy',
				'rule34gifs',
				'boobs',
				'tit',
				'Fingering',
				'dilf',
				'milf',
			], message, client);
		}
		catch (err) { client.error(err, message); }
	},
};