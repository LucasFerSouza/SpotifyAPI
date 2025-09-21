import express from "express";
import pool from "../connection.js";

const musicRouter = express.Router();

// Lista todas as músicas do BD
musicRouter.get("/tracks", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM tracks");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar músicas" });
  }
});

// Insere uma música manualmente
musicRouter.post("/tracks", async (req, res) => {
  const { track_name, artist_name, release_date, popularity } = req.body;
  try {
    await pool.query(
      "INSERT INTO tracks (track_name, artist_name, release_date, popularity) VALUES ($1, $2, $3, $4)",
      [track_name, artist_name, release_date, popularity]
    );
    res.json({ message: "Música inserida com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao inserir música" });
  }
});

export default musicRouter;
