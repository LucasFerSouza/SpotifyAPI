import pool from "../connection.js";

const updateSong = async (req, res) => {
  const { id } = req.params;
  const { track_name } = req.body;

  const result = await pool.query(
    "UPDATE tracks SET track_name=$1 WHERE id=$2 RETURNING *",
    [track_name, id]
  );

  res.json(result.rows[0]);
};

export default updateSong;
