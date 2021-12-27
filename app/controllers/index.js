module.exports.home = function(app, req, res) {
    const date = new Date(Date.now());
    res.render('index', {
        pagina: 'home',
        session: req.session,
        minutes: (60*date.getHours()) + date.getMinutes()
    });
}

module.exports.bots = function(app, req, res) {
    const {bots, selfos, snipers} = app.ds;
    res.render('index', {
        pagina: 'bots',
        session: req.session,
        bots: bots,
        selfos: selfos,
        snipers: snipers
    });
}

module.exports.updateTime = function(app, req, res) {
    res.redirect('/');
}