const { Pool } = require("pg");

const client = new Pool({
  user: process.env.DBUSER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
    require: true,
  },
});

module.exports = client;
