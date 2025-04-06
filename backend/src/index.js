const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const clipsRoutes = require("./routes/clips");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// using Prometheus to monitor the server

const client = require("prom-client");

// Prometheus registry
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Define custom counters
const totalRequests = new client.Counter({
  name: "api_requests_total",
  help: "Total number of API requests",
});

const streamCounter = new client.Counter({
  name: "clip_streams_total",
  help: "Total streams per clip",
  labelNames: ["clip_id"],
});

register.registerMetric(totalRequests);
register.registerMetric(streamCounter);

// Increment request counter middleware
app.use((req, res, next) => {
  totalRequests.inc();
  next();
});

// Metrics route
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

module.exports = { streamCounter }; // Export for controller usage

