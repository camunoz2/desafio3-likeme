const pg = require("pg");

const { Client } = pg;

const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

client
  .connect()
  .then(() => console.log("Conectado a la base de datos!"))
  .catch((err) => {
    console.log("Error: ", err);
    process.exit(1);
  });

module.exports = client;
