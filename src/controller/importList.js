import pool from "../connection.js";
import { getTopTracks } from "../services/topTracks.js";

const importList = async (_, res) => {
  try {
    const tracks = await getTopTracks();

    for (let t of tracks.slice(0, 10)) {
      await pool.query(
        "INSERT INTO tracks (track_name, artist_name, release_date, popularity) VALUES ($1, $2, $3, $4)",
        [t.track_name, t.artist_name, t.release_date, t.popularity]
      );
    }

    res.json({ message: "10 tracks imported" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao importar músicas" });
  }
};

export default importList;
