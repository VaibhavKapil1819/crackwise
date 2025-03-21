const supabase = require("../config/supabase");

// Signup
exports.signUp = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json({ message: "User registered successfully", data });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json({ message: "Login successful", data });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
