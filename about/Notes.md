# Passos para a entrevista:
1. Autenticar na API do Spotify
2. Buscar músicas mais ouvidas
3. Filtrar as 10 mais recentes
4. Buscar músicas dos artistas
5. Armazenar no PostgreSQL com segurança
6. Exibir no terminal

# Tecnicas e Boas Práticas a aplicar
*   Uso da dependência *axios* para requisições HTTP à base de dados do Spotfy
*   Uso da dependência *pg* para conexão com o PostgreSQL
*   Uso da dependência *dotenv* para variáveis de ambiente (⚠️ Segurança!)
*   Uso de SQL parametrizado para evitar SQL injection
*  	Código limpo com Async/Await 
*	Modularização para separar responsabilidades

# 1.Estrutura de Projeto 
project/
 ├─ src/
 │   ├─ index.js          -> entrada do app
 │   ├─ routes/spotify.js -> rotas
 │   ├─ db.js             -> conexão com Postgres
 │   └─ services/spotify.js -> integração com API externa
 ├─ .env                  -> variáveis seguras
 ├─ package.json

# 2.Instalação Inicial
    npm init -y
    npm install express pg axios dotenv 
    
# 3.Conexão Segura com o Postgres

* src/db.js
    import pg from "pg";
    import dotenv from "dotenv";

    dotenv.config();

    const pool = new pg.Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    export default pool;


* .env

    DB_HOST=localhost
    DB_NAME=mercurio
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=postgres
    SPOTIFY_TOKEN=coloque_aqui_o_token_temporario
    PORT=3000   

 
# 4. Criar Tabela no Postgres

    CREATE DATABASE ocult_spotify;

    CREATE TABLE tracks (
        id SERIAL PRIMARY KEY,
        track_name VARCHAR(200) NOT NULL,
        artist_name VARCHAR(200) NOT NULL,
        release_date DATE,
        popularity INT
    );

# 5. Integração com Spotify
* src/services/spotify.js
    
    import axios from "axios";

    const BASE_URL = "https://api.spotify.com/v1";

    const headers = {
        Authorization: `Bearer ${process.env.SPOTIFY_TOKEN}`
    };

    // Top músicas da semana (exemplo: Top 50 Global playlist ID)
    export async function getTopTracks() {
    
        const playlistId = "37i9dQZEVXbMDoHDwVN2tF"; // Top 50 Global
        const url = `${BASE_URL}/playlists/${playlistId}/tracks`;

        const res = await axios.get(url, { headers });
        return res.data.items.map(item => ({
            track_name: item.track.name,
            artist_name: item.track.artists.map(a => a.name).join(", "),
            release_date: item.track.album.release_date,
            popularity: item.track.popularity
        }));
    }


    // Últimos lançamentos de um artista

    export async function getLatestReleases(artistId) {
        const url = `${BASE_URL}/artists/${artistId}/albums?limit=10&include_groups=single,album`;
        const res = await axios.get(url, { headers });

        return res.data.items.map(album => ({
            album_name: album.name,
            release_date: album.release_date
        }));
    }

# 6.1 Função Node para gerar o token
* src/services/auth.js

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Authorization": `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    return response.data.access_token; // Esse é o token Bearer
  } catch (err) {
    console.error("Erro ao gerar token:", err.response?.data || err.message);
    return null;
  }
}

# 6.2 Rota de API
 * src/routes/spotify.js

    import express from "express";
    import pool from "../db.js";
    import { getTopTracks, getLatestReleases } from "../services/spotify.js";

    const router = express.Router();

    // Importa as top tracks e salva no banco

    router.get("/import", async (req, res) => {
        try {
            const tracks = await getTopTracks();

            for (let t of tracks) {
                await pool.query(
                "INSERT INTO tracks (track_name, artist_name, release_date, popularity) VALUES ($1, $2, $3, $4)",
                [t.track_name, t.artist_name, t.release_date, t.popularity]);
            }

            res.json({ message: "Tracks imported successfully!", count: tracks.length });
        } 
        catch (err) {
            console.error(err);
            res.status(500).json({ error: "Erro ao importar músicas" });
        }
    });

    // Pega as 10 músicas mais recentes
    router.get("/latest", async (req, res) => {
    
        try {
            const result = await pool.query(
            "SELECT * FROM tracks ORDER BY release_date DESC LIMIT 10");
            res.json(result.rows);
        } 
        catch (err) {
            res.status(500).json({ error: "Erro ao buscar lançamentos" });
        }
    });

    export default router;


# 7.Arquivo Principal

* src/index.js

    import express from "express";
    import dotenv from "dotenv";
    import spotifyRoutes from "./routes/spotify.js";

    dotenv.config();

    const app = express();
    app.use(express.json());

    app.use("/spotify", spotifyRoutes);

    app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port " + process.env.PORT);
    });




# 8.Como testar no navegador/Postman

GET http://localhost:3000/spotify/import
→ puxa do Spotify e salva no banco.

GET http://localhost:3000/spotify/latest
→ pega as 10 músicas mais recentes do banco.

✅ Resultado final

Você mostra que sabe integrar com API externa (Spotify).

Você persiste dados no Postgres via pgAdmin 4.

Você organiza em camadas (services, db, routes).

Você aplica segurança mínima (.env, queries parametrizadas).