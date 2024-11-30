const pg = require("pg");

const { Client } = pg;

const client = new Client({
  user: "desafiolatam",
  host: "localhost",
  database: "likeme",
  password: "desafiolatam",
  port: 5432,
});

client
  .connect()
  .then(() => console.log("Conectado a la base de datos!"))
  .catch((err) => {
    console.log("Estoy usando el puerto 5432 para la db x si acaso: ", err);
  });

module.exports = client;
