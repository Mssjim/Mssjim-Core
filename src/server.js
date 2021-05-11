const express = require('express');
const consign = require('consign');
const expressSession = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');
  
app.use(express.static('./app'));
app.use(expressSession({
    secret: require('./settings.json').expressSecret,
    resave: false,
    saveUninitialized:false
}));

app.db = require('./database.js');
app.ds = require('./discord.js')

consign()
    .include('app/routes')
    .then('app/controllers')
    .into(app);
    
module.exports = app;