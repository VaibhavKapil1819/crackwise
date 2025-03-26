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
        const { data, error } = await supabase.from("coding_questions").select("*");

        if (error) throw error;

        res.status(200).json({ questions: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🔹 Get a Single Coding Question by ID
exports.getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Debugging: Log the received ID
        console.log("Received ID:", id);

        const { data, error } = await supabase
            .from("coding_questions")
            .select("*")
            .eq("id", id)
            .maybeSingle(); // ✅ Changed to `maybeSingle()`

        // ✅ Debugging: Log the result from Supabase
        console.log("Supabase Response:", data, error);

        if (error) {
            console.error("Supabase Error:", error);
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: "Question not found" });
        }

        res.status(200).json({ question: data });
    } catch (err) {
        console.error("Internal Server Error:", err);
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

