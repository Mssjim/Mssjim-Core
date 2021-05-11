const { Database } = require('sileco.db');
const db = new Database('./src/data.json');

module.exports = db;