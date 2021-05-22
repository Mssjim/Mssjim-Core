const { Database } = require('sileco.db');
const db = new Database('./jsons/data.json');

module.exports = db;