const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const noteRoutes = require("./Routes/noteRoutes");
const userRoutes = require("./Routes/userRoutes");
const protect = require("./Middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// API test route
app.get("/", (req, res) => {
    res.send("API Running");
});

// Notes routes (protected)
app.use("/api/notes", protect, noteRoutes);

// User routes
app.use("/api/users", userRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});