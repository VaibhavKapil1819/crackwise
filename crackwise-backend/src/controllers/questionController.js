const supabase = require("../config/supabase");

// 🔹 Create a New Coding Question
exports.createQuestion = async (req, res) => {
    try {
        const { title, description, function_templates, test_cases, difficulty, constraints } = req.body;

        if (!title || !description || !function_templates || !test_cases || !difficulty) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data, error } = await supabase
            .from("coding_questions")
            .insert([{ title, description, function_templates, test_cases, difficulty, constraints }])
            .select();

        if (error) throw error;

        res.status(201).json({ message: "Question created successfully", question: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🔹 Get All Coding Questions
exports.getAllQuestions = async (req, res) => {
    try {
        console.log("📌 Fetching all questions...");

        const { data, error } = await supabase.from("coding_questions").select("*");

        console.log("🛠 Supabase Response:", data, error); // Debugging log

        if (error) throw error;

        res.status(200).json({ questions: data });
    } catch (err) {
        console.error("🔥 Internal Server Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        let { id } = req.params;

        console.log("📌 Received ID from Request:", id); // Debugging log

        // Ensure the ID is a valid UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({ error: "Invalid UUID format" });
        }

        console.log("🔍 Querying Supabase with UUID:", id);

        const { data, error } = await supabase
            .from("coding_questions")
            .select("*")
            .eq("id", id)  // ✅ UUID should be passed as a string
            .maybeSingle();

        console.log("🛠 Supabase Response:", data, error); // Debugging log

        if (error) {
            console.error("❌ Supabase Error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            console.warn("⚠️ Question not found!");
            return res.status(404).json({ error: "Question not found" });
        }

        res.status(200).json({ question: data });
    } catch (err) {
        console.error("🔥 Internal Server Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

// 🔹 Update a Coding Question
exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const { data, error } = await supabase.from("coding_questions").update(updateData).eq("id", id).select();

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json({ message: "Question updated successfully", question: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🔹 Delete a Coding Question
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase.from("coding_questions").delete().eq("id", id);

        if (error) return res.status(400).json({ error: error.message });

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

