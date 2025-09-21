import express from 'express';
import pool from '../database.js';
import { getSpotifyToken } from '../services/auth.js';
import { getTop50GlobalTracks, getTopTracksByArtist } from '../services/spotify.js';

const router = express.Router();

router.get('/import', async (req, res) => {
  try {
    const token = await getSpotifyToken();

    const topTracks = await getTop50GlobalTracks(token);

    // Ordena e pega 10 mais recentes
    const latest10Tracks = topTracks
      .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      .slice(0, 10);

    let artistTracks = [];
    for (const track of latest10Tracks) {
      const tracksByArtist = await getTopTracksByArtist(token, track.artist_id);
      artistTracks = artistTracks.concat(tracksByArtist);
    }

    const allTracksToInsert = [...latest10Tracks, ...artistTracks];

    const insertPromises = allTracksToInsert.map(track =>
      pool.query(
        `INSERT INTO tracks (track_name, artist_name, release_date, popularity)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (track_name, artist_name) DO NOTHING`,
        [track.track_name, track.artist_name, track.release_date, track.popularity]
      )
    );

    await Promise.all(insertPromises);

    res.json(latest10Tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao importar músicas' });
  }
});

export default router;