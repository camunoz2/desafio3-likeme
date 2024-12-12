const client = require("./db");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

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

app.put("/posts/like/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      res.status(404).send("Post con ese id no encontrado");
    }
    const query = `UPDATE posts SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *;`;
    const values = [postId];
    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).send("post no encontrado");
    }

    res
      .status(200)
      .json({ message: "Agregaste un like!", post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error de servidor@");
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      return res.status(400).json({ message: "ID de post no proporcionado" });
    }

    const query = `DELETE FROM posts WHERE id = $1 RETURNING *`;
    const values = [postId];
    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    res
      .status(200)
      .json({ message: "Post eliminado con éxito", post: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al eliminar el post" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
