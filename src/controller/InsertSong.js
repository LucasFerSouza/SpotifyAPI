import pool from "../connection.js";

const insertSong = async (req, res) => {
  const { track_name, artist_name, release_date, popularity } = req.body;

  const result = await pool.query(
    "INSERT INTO tracks (track_name, artist_name, release_date, popularity) VALUES ($1, $2, $3, $4) RETURNING *",
    [track_name, artist_name, release_date, popularity]
  );

  res.json(result.rows[0]);
};

export default insertSong;
