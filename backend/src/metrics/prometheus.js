const client = require("prom-client");

const register = new client.Registry();
client.collectDefaultMetrics({ register });

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

module.exports = {
  register,
  totalRequests,
  streamCounter,
};
