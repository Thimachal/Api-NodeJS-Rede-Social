const {Pool} = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'rede_social',
    password: '1234',
    port: 5432
});

const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = {
    query
};