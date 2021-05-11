module.exports = function(app) {
    app.get('/', (req, res) => {
        app.app.controllers.index.home(app, req, res);
    });

    app.get('/bots', (req, res) => {
        app.app.controllers.index.bots(app, req, res);
    });

    app.get('/updateTime', (req, res) => {
        app.app.controllers.index.updateTime(app, req, res);
    });
}