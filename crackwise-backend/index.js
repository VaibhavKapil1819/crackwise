require("dotenv").config();
const express = require("express");
const cors = require("cors");


const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const questionRoutes = require("./src/routes/questionRoutes");
const codeExecutionRoutes = require("./src/routes/codeExecutionRoutes");

const executionRoutes = require("./src/routes/aiRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/questions", questionRoutes); 
app.use("/api", codeExecutionRoutes);
app.use("/ai", executionRoutes); // ✅ Add AI routes

app.get("/", (req, res) => {
    res.send("Crackwise Backend is Running...");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
});
