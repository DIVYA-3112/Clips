# 🎧 Clips Backend

This is the backend service for **Clips**, an audio streaming application that serves short audio previews. Built with Node.js and PostgreSQL, it features efficient audio streaming, metrics monitoring with Prometheus and Grafana, and a clean REST API.

## 🚀 Features

- ⚡ Stream short audio previews
- 📦 PostgreSQL integration for metadata storage
- 📊 Monitoring with Prometheus + Grafana
- 🔐 Environment-based configuration
- 🧪 Easy testing & modular structure

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **PostgreSQL**
- **Prometheus** & **Grafana** (Monitoring)
- **pg** (Node PostgreSQL client)


## ⚙️ Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL
- Docker (optional, for containerization)

### Environment Variables

Create a `.env` file:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/clips
```
