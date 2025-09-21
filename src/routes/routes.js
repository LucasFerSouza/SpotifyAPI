import express from "express";
import spotifyRouter from "./spotify.js";
import musicRouter from ".";

const router = express.Router();

// Health check
router.get("/", (_, res) => res.json({ message: "API funcionando 🚀" }));

// Agrupamento de rotas
router.use("/spotify", spotifyRouter);  // → /spotify/import , /spotify/latest
router.use("/music", musicRouter);      // → /music/tracks , /music/latest

export default router;
