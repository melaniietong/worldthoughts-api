const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "4656",
    host: "localhost",
    port: 5432,
    database: "worldthoughts"
});

module.exports = pool;