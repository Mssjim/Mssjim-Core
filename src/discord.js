const { Client } = require('selfo.js');
const unirest = require('unirest');
const crc = require('crc');

const nitroGenerator = require('./nitro-generator.js');

const mssjim = new Client();
const ruby = new Client();
const emerald = new Client();
const penumbra = new Client();
const nitro = new Client();

const selfos = [];
const snipers = [];

const { tokens, guilds, channels, catcher, typeDelay} = require('../jsons/settings.json');

mssjim.on('ready', () => {
    console.log(`\x1b[35m${mssjim.user.username}\x1b[0m`);
}).login(tokens.mssjim);

ruby.on('ready', () => {
    console.log(`\x1b[35m${ruby.user.username}\x1b[0m`);
}).login(tokens.ruby);

emerald.on('ready', () => {
    console.log(`\x1b[35m${emerald.user.username}\x1b[0m`);
}).login(tokens.emerald);

penumbra.on('ready', () => {
    console.log(`\x1b[35m${penumbra.user.username}\x1b[0m`);
}).login(tokens.penumbra);

nitro.on('ready', () => {
    console.log(`\x1b[35m${nitro.user.username}\x1b[0m`);

    nitroGenerator.gen(nitro, channels.nitro);
}).login(tokens.nitro);

tokens.selfos.forEach(token => {
    const selfo = new Client().on('ready', () => { 
        console.log(`\x1b[92m${selfo.user.username}\x1b[0m`);
    });
    
    selfo.login(token);

    selfos.push(selfo);
});

tokens.snipers.forEach((token, i) => {
    const sniper = new Client().on('ready', () => {
        console.log(`\x1b[94m${sniper.user.username}\x1b[0m`);
        return;
		setInterval(() => {
			if(i<5) {
				sniper.channels.get(channels.spamChannels[0]).send(catcher.spamMessage);
			} else if(i<10) {
				sniper.channels.get(channels.spamChannels[1]).send(catcher.spamMessage);
			} else if(i<15) {
				sniper.channels.get(channels.spamChannels[2]).send(catcher.spamMessage);
			} else if(i<20) {
				sniper.channels.get(channels.spamChannels[3]).send(catcher.spamMessage);
			} else {
				console.log("ATENSAO");
			}
		}, catcher.spamDelay);
    });
    
    sniper.login(token);

    snipers.push(sniper);
});

// Pokemon Catcher
mssjim.on('message', msg => {
    return;
	if(msg.author.id != '669228505128501258' || msg.guild == undefined) return;
    if(channels.catchChannels.includes(msg.channel.id)) {
        msg.embeds.forEach(embed => {
            if(embed.title == undefined) return;
            if(embed.title.includes('A wild pokémon has аppeаred!') && embed.image != undefined) {
                var request = unirest.get(embed.image.url);
                request.end(res => {

                    var key = crc.crc32(Buffer.from(res.body)).toString('16');
					let value = require('../jsons/pokemons.json')[key];
					
					if(value != undefined) {
						setTimeout(function() {
							mssjim.channels.get(embed.message.channel.id).send(`.c ${value}`);
						}, value.length * catcher.catchDelay);
					}
                });
            }
        });
    }
});

// Message Steal
var lastMsgAuthor = "";
var randomBot = 0;

emerald.on('message', message => {
    return;
    if(message.channel.id == channels.rocha) {
        if(message.author.bot || message.content == undefined) return;
        if(message.author.id == emerald.user.id || message.content == undefined) return;

        var msg = message.content;
        if(msg.length<1) return;

        //msg = msg.replace(/<:.+?:\d+>/g, '1kfegsno');
		
		var msgImage = "";
		var msgAuthor = "";
		
        if(lastMsgAuthor != message.author.id) {
            lastMsgAuthor = message.author.id;
			msgImage = `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=128`;
			msgAuthor = `\`${message.author.tag}\`\n`;

            if(randomBot < selfos.length - 1) {
                randomBot++;
            } else {
                randomBot = 0;
            }
        }

        const emojis = selfos[randomBot].guilds.get(guilds.enigma).emojis.map(emoji => emoji.toString());

        while(msg.includes('1kfegsno')) {
			msg = msg.replace('1kfegsno', emojis[Math.floor(Math.random() * emojis.length)]);
		}

		const i = randomBot;

        selfos[i].channels.get(channels.enigma).startTyping();
        setTimeout(() => {
            selfos[i].channels.get(channels.enigma).send(msgImage);
            selfos[i].channels.get(channels.enigma).send(msgAuthor + msg);
            selfos[i].channels.get(channels.enigma).stopTyping();
        }, msg.replace(/<:.+?:\d+>/g, '').length * typeDelay);
    }
    
    if(message.channel.id == channels.enigma) {
        if(message.author.bot || message.content == undefined) return;
        if(message.author.id == emerald.user.id) return;

        var msg = message.content;

        selfos.forEach(selfo => {
			if(message.author.id == selfo.user.id)
				msg = undefined;
		});
		
        if(msg == undefined || msg.length < 1) return;

        msg = msg.replace(/<:.+?:\d+>/g, '1kfegsno');

        const emojis = emerald.guilds.get(guilds.rocha).emojis.map(emoji => emoji.toString());

		while(msg.includes('1kfegsno')) {
			msg = msg.replace('1kfegsno', emojis[Math.floor(Math.random() * emojis.length)]);
		}

        emerald.channels.get(channels.rocha).startTyping();
        setTimeout(() => {
            emerald.channels.get(channels.rocha).send(msg);
            emerald.channels.get(channels.rocha).stopTyping();
        }, msg.replace(/<:.+?:\d+>/g, '').length * typeDelay);
    }
});

// Timers
setInterval(() => {
    const date = new Date(Date.now());
    const minutes = (60*date.getHours()) + date.getMinutes();
    if(minutes == 0) { // Daily
        mssjim.channels.get(channels.daily).send('^daily');
        mssjim.channels.get(channels.daily).send('yuidaily');

        mssjim.channels.get(channels.dailyRocha).send('<weekly');
        mssjim.channels.get(channels.dailyRocha).send('<daily');
        mssjim.channels.get(channels.dailyRocha).send('t!daily');
        mssjim.channels.get(channels.dailyRocha).send('p!daily');
        mssjim.channels.get(channels.dailyRocha).send('mantaro daily');
        
        mssjim.channels.get(channels.mudae).send('$dk');
        mssjim.channels.get(channels.mudae).send('$daily');

        snipers.forEach(sniper => {
            sniper.channels.get(channels.daily).send('>daily');
            sniper.channels.get(channels.daily).send('>weekly');
            sniper.channels.get(channels.daily).send('>rep <@446678418147508236> all');
            sniper.channels.get(channels.daily).send('^daily');
            sniper.channels.get(channels.daily).send('^rep <@446678418147508236>');
            sniper.channels.get(channels.daily).send('t!daily');
            sniper.channels.get(channels.daily).send('t!rep <@446678418147508236>');
            sniper.channels.get(channels.daily).send('yuidaily');
            sniper.channels.get(channels.daily).send('yuirep <@446678418147508236>');
        });
    }

    if(minutes == 30) { // Pay
        // TODO Payments
    }

    if(minutes % 120 == 0) { // 2Hrs
        mssjim.channels.get(channels.mudaePoke).send('$p');
    }

    if(minutes % 121 == 0) { // 2 Horas
        mssjim.channels.get(channels.bump).send('!d bump');
    }
}, 1000*60);

module.exports.bots = [
    mssjim, ruby, emerald, penumbra, nitro
];

module.exports.selfos = selfos;

module.exports.snipers = snipers;