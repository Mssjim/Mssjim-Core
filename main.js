const app = require('./src/server.js');
const ds = require('./src/discord.js');

var port = (process.argv.slice(2).length < 1) ? 5000 : process.argv.slice(2);

function start(port) {
    console.log('O Pai ta Verificando a Porta ' + port);

    app.listen(+port, function() {
        console.log(`O Pai ta On! [localhost:${port}]`);
        console.log("\033[1;36m=================================\033[0m");
    });
}

process.on('uncaughtException', (err) => {
    process.stdout.write("\033[1;31mErro: \033[0m");

    if(err.code == "EADDRINUSE") {
        console.log("Porta ["+port+"] Ocupada!");
        port = Math.floor(1000 + Math.random() * 9000);
    
        start(port);
    } else {
        console.log(err);
    }
})

start(port);
