require("dotenv").config(); 
const { createClient } = require("@supabase/supabase-js");
// Load environment variables

const supabaseUrl = process.env.SUPABASE_URL;
console.log("superbaseurl:",supabaseUrl);
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
console.log("supabaseAnonKey:",supabaseAnonKey);

// Check if the env variables are loaded correctly
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
