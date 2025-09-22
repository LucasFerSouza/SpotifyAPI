import pool from "../connection.js";

const deleteSong = async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM tracks WHERE id=$1", [id]);
  res.json({ message: "Música deletada" });
};

export default deleteSong;
