const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const supabase = require("../config/supabase");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
exports.signup = async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the email already exists
        const { data: existingUser, error: checkError } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into Supabase
        const { data: user, error: userError } = await supabase
            .from("users")
            .insert([{ email, password: hashedPassword, first_name, last_name }])
            .select()
            .single();

        if (userError) {
            return res.status(500).json({ message: userError.message });
        }

        // Create a profile entry for the new user
        const { error: profileError } = await supabase
            .from("profiles")
            .insert([{ id: user.id, full_name: `${first_name} ${last_name}` }]);

        if (profileError) {
            return res.status(500).json({ message: "User registered but profile creation failed" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(201).json({ message: "User registered successfully", token, user });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, password")
            .eq("email", email)
            .single();

        if (error || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({ message: "Login successful", token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
