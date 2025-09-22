import express from "express";
import dotenv from "dotenv";
import spotifyRoutes from "./routes/routes.js"; // Corrigido caminho

dotenv.config();
const app = express();

app.use(express.json());
app.use("/spotify", spotifyRoutes); // todas as rotas começam com /spotify

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
