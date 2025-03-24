const supabase = require("../config/supabase");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to extract user from token
const getUserFromToken = (req) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
    if (!token) return null;

    try {
        return jwt.verify(token, JWT_SECRET); // Decode the token
    } catch (error) {
        return null;
    }
};

// 🔹 GET Profile API
exports.getProfile = async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error) return res.status(404).json({ error: "Profile not found" });

        res.status(200).json({ profile: data });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🔹 UPDATE Profile API
exports.updateProfile = async (req, res) => {
    try {
        const user = getUserFromToken(req);
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { full_name, bio, profile_pic, skills, experience, preferred_role, interview_preferences } = req.body;

        const { data, error } = await supabase
            .from("profiles")
            .update({ full_name, bio, profile_pic, skills, experience, preferred_role, interview_preferences })
            .eq("id", user.id)
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json({ message: "Profile updated successfully", profile: data[0] });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
