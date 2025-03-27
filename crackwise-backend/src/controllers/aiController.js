require("dotenv").config();
const axios = require("axios");

const generateFeedback = async (req, res) => {
    try {
        const { script, language } = req.body;
        const apiKey = process.env.GEMINI_API_KEY; // Use environment variable

        if (!apiKey) {
            return res.status(500).json({ error: "API key is missing" });
        }

        const aiPrompt = `
        Analyze the following ${language} code and provide feedback:
        - Correctness
        - Efficiency
        - Best Practices
        - Suggested Improvements
        - Score (0-100)

        **Code:**
        ${script}
        `;

        const aiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
            {
                contents: [{ role: "user", parts: [{ text: aiPrompt }] }]
            }
        );

        const feedback = aiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "No AI feedback available.";

        res.json({ feedback });
    } catch (error) {
        console.error("❌ AI Feedback Error:", error.response?.data || error.message);
        res.status(500).json({ error: "AI feedback generation failed." });
    }
};

module.exports = { generateFeedback };
