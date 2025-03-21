const supabase = require("../config/supabase");

// Signup
exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Insert data into Supabase
        const { data, error } = await supabase
            .from("users")
            .insert([{ email, password }])
            .select();

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(201).json({ message: "User registered successfully", user: data[0] });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists in the 'users' table
        const { data: user, error } = await supabase
            .from("users")
            .select("id, email, password")
            .eq("email", email)
            .single(); // Get only one user

        if (error || !user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 2. Check if the password matches (since it's plain text)
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. If credentials are correct, log the user in
        res.status(200).json({ message: "Login successful", user });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
