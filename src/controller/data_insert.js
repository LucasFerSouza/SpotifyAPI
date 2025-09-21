import pool from '../connection.js';
import { getTopTracks } from '../services/spotify.js';

const dataInsert = async (req, res) => {
  try {
    let tracks = [];

    // Se quiser inserir via requisição manual, permite body
    if (req.body && Object.keys(req.body).length > 0) {
      tracks = [req.body];
    } else {
      tracks = await getTopTracks();
    }

    const insertedRows = [];

    for (let track of tracks) {
      const { track_name, artist_name, release_date, popularity } = track;

      // Verifica duplicata (nome + artista + release_date, por ex.)
      const existing = await pool.query(
        `SELECT id FROM tracks WHERE track_name = $1 AND artist_name = $2 AND release_date = $3`,
        [track_name, artist_name, release_date]
      );

      if (existing.rows.length === 0) {
        const query = `
          INSERT INTO tracks (track_name, artist_name, release_date, popularity)
          VALUES ($1, $2, $3, $4)
          RETURNING *`;
        const params = [track_name, artist_name, release_date, popularity];
        const { rows } = await pool.query(query, params);
        insertedRows.push(rows[0]);
      }
    }

    return res.status(201).json(insertedRows);
  } catch (err) {
    console.error('Erro ao inserir dados:', err.stack || err.message);
    return res.status(500).json({ message: err.message });
  }
};

export { dataInsert };
