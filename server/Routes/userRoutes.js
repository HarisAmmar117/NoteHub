const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getUserByEmail } = require("../Controllers/UserController");
const protect = require("../Middlewares/authMiddleware"); // <-- destructure named export

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/email", protect, getUserByEmail);

module.exports = router;