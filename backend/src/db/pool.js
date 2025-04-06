// This code sets up a connection pool to a PostgreSQL database using the `pg` library.

const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

module.exports = pool;
