import axios from 'axios';

const SPOTIFY_API = 'https://api.spotify.com/v1';

export async function getTop50GlobalTracks(token) {
  const playlistId = '37i9dQZEVXbMDoHDwVN2tF';
  const response = await axios.get(`${SPOTIFY_API}/playlists/${playlistId}/tracks?limit=50`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data.items.map(item => {
    const track = item.track;
    return {
      id: track.id,
      track_name: track.name,
      artist_id: track.artists[0].id,
      artist_name: track.artists[0].name,
      release_date: track.album.release_date,
      popularity: track.popularity,
    };
  });
}

export async function getTopTracksByArtist(token, artistId) {
  const response = await axios.get(`${SPOTIFY_API}/artists/${artistId}/top-tracks?market=US`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return response.data.tracks.map(track => ({
    id: track.id,
    track_name: track.name,
    artist_name: track.artists[0].name,
    release_date: track.album.release_date,
    popularity: track.popularity,
  }));
}
