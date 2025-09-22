import pool from "../connection.js";

const latestSongs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tracks ORDER BY release_date DESC LIMIT 10"
    );
    console.log(result.rows); // Exibe no console
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar músicas" });
  }
};

export default latestSongs;
