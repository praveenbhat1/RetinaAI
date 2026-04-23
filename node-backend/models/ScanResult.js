const mongoose = require("mongoose");

const ScanResultSchema = new mongoose.Schema({
  userId: { type: String, required: true },       // Firebase UID or MongoDB ObjectId  
  userName: { type: String, default: "Anonymous" },
  userEmail: { type: String, default: "" },
  prediction: {
    type: String,
    enum: ["No DR", "Mild", "Moderate", "Severe", "Proliferative"],
    required: true,
  },
  confidence: { type: Number, required: true },
  scanId: { type: String, required: true, unique: true },
  imageSize: { type: String, default: "Unknown" },
  processingTime: { type: Number, default: 0 },   // ms
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ScanResult", ScanResultSchema);
