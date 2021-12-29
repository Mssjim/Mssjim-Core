
const { tokens, guilds, channels, catcher, typeDelay} = require('./settings.json');
const { Client } = require('selfo.js');

const bot = new Client();

const rollsCount = 12;
let roleta = false;
let rolls = [];

// Mudae
bot.on('message', msg => {
    if(msg.author.id != '432610292342587392' || msg.channel.id != '760232504715116545' || !roleta) return;
    if(msg.embeds?.length > 0) {
        const embed = msg.embeds[0];
        const kakera = parseInt(embed.description.substring(embed.description.indexOf('*'), embed.description.lastIndexOf('*')).replace(/[*]/g, ''));
        rolls.push({msg: msg, kakera: kakera});
    }
});

setInterval(() => {
    setTimeout(() => {
        const date = new Date(Date.now());
        const h = date.getHours();

        if(h%3 == 0) { // 3 Horas
            roleta = true;
            for(let i=0; i<rollsCount; i++) {
                setTimeout(() => {
                    bot.channels.get(channels.mudae).send('$wa');
                }, i*1000);
            }
            setTimeout(() => {
                try {
                    rolls = rolls.sort((a,b) => b.kakera - a.kakera);
                    rolls[0].msg.react(Array.from(rolls[0].msg.reactions.keys())[0]);
                } catch (error) { console.log(error) }
                roleta = false;
                rolls = [];
            }, 1500 * rollsCount);
        } else {
            roleta = true;
            for(let i=0; i<rollsCount; i++) {
                setTimeout(() => {
                    bot.channels.get(channels.mudae).send('$wa');
                }, i*1000);
            }
            setTimeout(() => {
                try {
                    rolls = rolls.sort((a,b) => b.kakera - a.kakera);
                    if(rolls[0].kakera > 120) {
                        rolls[0].msg.react(Array.from(rolls[0].msg.reactions.keys())[0]);
                    }
                } catch (error) { console.log(error) }
                roleta = false;
                rolls = [];
            }, 1500 * rollsCount);
        }
    }, 3*60*1000);
}, 60*60*1000);

bot.on('ready', () => {
    console.log(`\x1b[35m${bot.user.username}\x1b[0m`);
}).login(tokens.ruby);