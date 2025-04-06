const pool = require("./src/db/pool");

const clips = [
  {
    title: "Ocean Waves",
    description: "Relaxing sound of waves crashing",
    genre: "ambient",
    duration: "30s",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Chill Beat",
    description: "Smooth electronic chillout music",
    genre: "electronic",
    duration: "30s",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    title: "Birds Chirping",
    description: "Morning birds in the forest",
    genre: "ambient",
    duration: "30s",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    title: "Upbeat Pop",
    description: "Bright and energetic pop sample",
    genre: "pop",
    duration: "30s",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    title: "Rain Sounds",
    description: "Soft rain hitting the roof",
    genre: "ambient",
    duration: "30s",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    title: "Lo-Fi Piano",
    description: "Calm lo-fi piano loop",
    genre: "lofi",
    duration: "30s",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
];

const seedClips = async () => {
  try {
    for (const clip of clips) {
      await pool.query(
        `INSERT INTO clips (title, description, genre, duration, audio_url) 
         VALUES ($1, $2, $3, $4, $5)`,
        [clip.title, clip.description, clip.genre, clip.duration, clip.audio_url]
      );
    }
    console.log("✅ Clips seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding clips:", err);
    process.exit(1);
  }
};

seedClips();
