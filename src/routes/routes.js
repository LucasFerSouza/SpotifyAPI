import express from "express";
import importList from "../controller/importList.js";
import latestSongs from "../controller/latestSongs.js";
import insertSong from "../controller/insertSong.js";
import updateSong from "../controller/updateSong.js";
import deleteSong from "../controller/deleteSong.js";

const router = express.Router();

router.get("/import", importList);       // Importa músicas e salva no banco
router.get("/latest", latestSongs);      // Lista últimas 10 músicas
router.post("/tracks", insertSong);      // Insert manual
router.put("/tracks/:id", updateSong);   // Update manual
router.delete("/tracks/:id", deleteSong);// Delete manual

export default router;
