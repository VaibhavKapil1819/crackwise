const axios = require("axios");

// JDoodle API Credentials
const JDoodle_API_URL = "https://api.jdoodle.com/v1/execute";
const CLIENT_ID = "d1c718d5e9c016fde1a9e0bc3c7951c9"; // Replace with your JDoodle Client ID
const CLIENT_SECRET = "148c406c98446332c76e59ecbffc8098387158c1e379c1b85e7ba0d1586657a3"; // Replace with your JDoodle Secret

// Function to handle code execution
const executeCode = async (req, res) => {
    try {
        const { script, language } = req.body;

        // Prepare payload for JDoodle API
        const payload = {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            script: script,
            language: language,
            versionIndex: "0",
        };

        // Send request to JDoodle API
        const response = await axios.post(JDoodle_API_URL, payload);

        // Send JDoodle response back to frontend
        res.json(response.data);
    } catch (error) {
        console.error("Error executing code:", error.message);
        res.status(500).json({ error: "Failed to execute code" });
    }
};

module.exports = { executeCode };
