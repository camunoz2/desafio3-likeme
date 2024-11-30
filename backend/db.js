const pg = require("pg");

const { Client } = pg;

const client = new Client({
  user: process.env.USERNAME,
  host: process.env.HOSTNAME,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  ssl: true,
});

client
  .connect()
  .then(() => console.log("Conectado a la base de datos!"))
  .catch((err) => {
    console.log("Error: ", err);
  });

module.exports = client;
