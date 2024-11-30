const client = require("./db");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.get("/posts", async (req, res) => {
  try {
    const { rows } = await client.query("select * from posts");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error obteniendo los posts: ", err);
  }
});

app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;

  if (!titulo || !url || !descripcion) {
    res.status(400).send("Falta o el titulo o la url o la descripcion");
  }

  try {
    const query = `insert into posts (titulo, img, descripcion) values ($1, $2, $3)`;
    const values = [titulo, url, descripcion];
    const result = await client.query(query, values);
    res.status(201).send(result.rows[0]);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Error al insertar el post a la db");
  }
});

app.listen(3000, () => {
  console.log("Servidor en puerto 3000");
});
