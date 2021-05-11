const request = require('request');

genUrl = function() {
    let code = "";
    let dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (var i = 0; i < 16; i++) code += dict.charAt(Math.floor(Math.random() * dict.length));

    return code;
};

function loop(code, client, channel) {
    request({
        uri: 'https://discordapp.com/api/v6/entitlements/gift-codes/' + code,
        json: true
    }, (err, res, body) => {
        if(!err) {
            var result = JSON.stringify(body);    
            if(result == null || result == undefined) return;
            
            if (result.match("limited")) {
                let delay = result.substring(result.indexOf('"retry_after":') + 14, result.length -1);
                
                client.channels.get(channel).send('`' + code + ' - Rate Limited, aguardando ' + Math.round(delay/1000) + ' segundos`');
                setTimeout(() => {
                    loop(code, client, channel);
                }, delay);
            } else if (result.match("Unknown Gift Code")) {
                client.channels.get(channel).send('`' + code + ' - Invalid Gift Code`');
                setTimeout(() => {
                    loop(genUrl(), client, channel);
                }, 5000);
            } else {
                client.channels.get(channel).send('`' + code + ' - Valid Gift Code!!!`');
                client.channels.get(channel).send('<@446678418147508236> https://discord.com/gifts/' + code);
                loop(genUrl(), client, channel);
            }
        } else {
            setTimeout(() => {
                loop(code, client, channel);
            }, 5000);
        }
    });
}

module.exports.gen = (client, channel) => loop(genUrl(), client, channel);