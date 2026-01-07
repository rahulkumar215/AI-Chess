import express from "express";
const router = express.Router();

// Dummy route
router.get("/dummy", (req, res) => {
  res.json({ message: "This is a dummy route." });
});

export default router;
