const pool = require("../db/pool");

exports.getAllClips = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clips ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch clips" });
  }
};


const path = require("path");

exports.streamClip = async (req, res) => {
  const clipId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM clips WHERE id = $1", [clipId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Clip not found" });
    }

    const clip = result.rows[0];

    // Increment play count
    await pool.query("UPDATE clips SET play_count = play_count + 1 WHERE id = $1", [clipId]);

    // Stream the remote .mp3 file (we're redirecting to the audio URL)
    res.redirect(clip.audio_url);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to stream clip" });
  }
};


exports.getClipStats = async (req, res) => {
    const clipId = req.params.id;
  
    try {
      const result = await pool.query("SELECT * FROM clips WHERE id = $1", [clipId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Clip not found" });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch clip stats" });
    }
  };


// This code is for streaming audio clips from a PostgreSQL database.

const { streamCounter } = require("../index");

exports.streamClip = async (req, res) => {
  const clipId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM clips WHERE id = $1", [clipId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Clip not found" });
    }

    const clip = result.rows[0];

    // Increment play count in DB
    await pool.query("UPDATE clips SET play_count = play_count + 1 WHERE id = $1", [clipId]);

    // Increment Prometheus counter
    streamCounter.labels(clipId).inc();

    res.redirect(clip.audio_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to stream clip" });
  }
};

  