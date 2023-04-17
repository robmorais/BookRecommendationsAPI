const { Pool } = require('pg');

const pool = new Pool({
    user: 'devadmin',
    host: 'localhost',
    database: 'books',
    password: 'devp2023',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};