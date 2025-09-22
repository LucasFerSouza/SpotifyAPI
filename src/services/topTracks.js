import axios from "axios";
import { getSpotifyToken } from "./auth.js";

export async function getTopTracks() {
  const token = await getSpotifyToken();

  const response = await axios.get(
    "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data.items.map((t) => ({
    track_name: t.track.name,
    artist_name: t.track.artists[0].name,
    release_date: t.track.album.release_date,
    popularity: t.track.popularity,
  }));
}
