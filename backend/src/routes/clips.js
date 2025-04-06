const express = require("express");
const router = express.Router();

const {
  getAllClips,
  streamClip,
  getClipStats
} = require("../controllers/clipsController");

router.get("/", getAllClips);
router.get("/:id/stream", streamClip);
router.get("/:id/stats", getClipStats);

module.exports = router;
