const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────
const authRoutes = require("./routes/auth");
const scanRoutes = require("./routes/scans");

app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);

// ── Health check ────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "RetinaAI Node.js + Express Backend",
    database: "MongoDB",
    version: "1.0.0",
    endpoints: {
      auth: { register: "POST /api/auth/register", login: "POST /api/auth/login", me: "GET /api/auth/me" },
      scans: { save: "POST /api/scans", list: "GET /api/scans?userId=<id>", stats: "GET /api/scans/stats", delete: "DELETE /api/scans/:scanId" },
    },
  });
});

// ── DB + Server Start ────────────────────────────────
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/retinaai";

console.log("⏳  Connecting to MongoDB...");
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅  MongoDB connected →", MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀  Node/Express server running on http://localhost:${PORT}`);
      console.log(`📋  Health:  GET  http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    console.log("⚠️  Starting server without MongoDB for health check availability...");
    app.listen(PORT, () => {
       console.log(`🚀  Node/Express server (Offline Mode) running on http://localhost:${PORT}`);
    });
  });
