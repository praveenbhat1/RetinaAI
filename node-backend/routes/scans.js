const express = require("express");
const ScanResult = require("../models/ScanResult");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST /api/scans  — save a new scan result to MongoDB
router.post("/", async (req, res) => {
  try {
    const { userId, userName, userEmail, prediction, confidence, scanId, imageSize, processingTime } = req.body;
    if (!userId || !prediction || !confidence || !scanId)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    const scan = await ScanResult.create({
      userId, userName, userEmail, prediction,
      confidence: parseFloat(confidence),
      scanId, imageSize, processingTime,
    });

    res.status(201).json({ success: true, message: "Scan saved to MongoDB", scan });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: "Scan ID already exists" });
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// GET /api/scans?userId=xxx  — retrieve scan history for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const scans = await ScanResult.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: scans.length, scans });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// GET /api/scans/stats  — aggregate stats for dashboard
router.get("/stats", async (req, res) => {
  try {
    const total = await ScanResult.countDocuments();
    const byStage = await ScanResult.aggregate([
      { $group: { _id: "$prediction", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const latest = await ScanResult.findOne().sort({ createdAt: -1 });
    res.json({ success: true, total, byStage, latest });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

// DELETE /api/scans/:scanId  — remove a scan
router.delete("/:scanId", async (req, res) => {
  try {
    const scan = await ScanResult.findOneAndDelete({ scanId: req.params.scanId });
    if (!scan) return res.status(404).json({ success: false, message: "Scan not found" });
    res.json({ success: true, message: "Scan deleted from MongoDB" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
