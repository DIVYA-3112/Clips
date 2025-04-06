const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const clipsRoutes = require("./routes/clips");
const { register, totalRequests } = require("./metrics/prometheus");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// increment total requests counter
app.use((req, res, next) => {
  totalRequests.inc();
  next();
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/clips", clipsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

//connect to the database
const pool = require("./db/pool");

app.get("/test-db", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    res.json({ success: true, time: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log("Server running on 0.0.0.0:5000");
});

