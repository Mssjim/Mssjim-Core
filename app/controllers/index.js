module.exports.home = function(app, req, res) {
    res.render('index', {
        pagina: 'home',
        session: req.session,
        minutes: app.db.fetch('minutes')
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
    const date = new Date(Date.now());
    app.db.set('minutes', (60*date.getHours()) + date.getMinutes())
    res.redirect('/');
}