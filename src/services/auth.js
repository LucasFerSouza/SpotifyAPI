import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let cachedToken = null;
let tokenExpiry = null;

export async function getSpotifyToken() {
  if (cachedToken && tokenExpiry && tokenExpiry > Date.now()) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const tokenResponse = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
    }
  );

  cachedToken = tokenResponse.data.access_token;
  tokenExpiry = Date.now() + tokenResponse.data.expires_in * 1000; // em ms

  return cachedToken;
}
