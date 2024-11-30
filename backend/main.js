const client = require("./db");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

app.get("/test", async (req, res) => {
  try {
    const result = await client.query("select * from posts");
    res.json({ message: result });
  } catch (err) {
    console.error("Error in /test", err);
    res.status(500).send("Error con el query a la db");
  }
});

app.listen(3000, () => {
  console.log("Servidor");
});
