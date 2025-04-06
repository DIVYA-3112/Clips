const express = require("express");
const router = express.Router();

const {
  getAllClips,
  streamClip,
  getClipStats,
  addClip,
  deleteClip
} = require("../controllers/clipsController");

router.get("/", getAllClips);
router.get("/:id/stream", streamClip);
router.get("/:id/stats", getClipStats);
router.post("/", addClip);
router.delete("/:idOrTitle", deleteClip);

module.exports = router;
