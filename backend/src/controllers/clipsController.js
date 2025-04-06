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

const {streamCounter} = require("../index");

exports.streamClip = async (req, res) => {
  console.log("streamCounter:", streamCounter);
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
    streamCounter.labels({ clipId }).inc();

    res.redirect(clip.audio_url);
  } catch (err) {
    console.error("Stream Error:", err.message);
    res.status(500).json({ error: "Failed to stream clip", details: err.message });
  }
};

exports.addClip = async (req, res) => {
  const { title, description, genre, duration, audio_url } = req.body;

  if (!title || !description || !genre || !duration || !audio_url) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO clips (title, description, genre, duration, audio_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, genre, duration, audio_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding clip:", err);
    res.status(500).json({ error: "Failed to add clip" });
  }
};


exports.deleteClip = async (req, res) => {
  const { idOrTitle } = req.params;

  try {
    let result;

    // Check if the param is a number (ID)
    if (!isNaN(idOrTitle)) {
      result = await pool.query(
        `DELETE FROM clips WHERE id = $1 RETURNING *`,
        [parseInt(idOrTitle)]
      );
    } else {
      result = await pool.query(
        `DELETE FROM clips WHERE title ILIKE $1 RETURNING *`,
        [idOrTitle]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Clip not found" });
    }

    res.status(200).json({ message: "Clip deleted", clip: result.rows[0] });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete clip", details: err.message });
  }
};


