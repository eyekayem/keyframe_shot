import { v4 as uuidv4 } from "uuid";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method IS NOT allowed' });
    }

    // Debugging logs
    console.log("🔍 Debug Request Body:", req.body);

    const { user_id, title, idea_id, prompt } = req.body;

    // Ensure `prompt` is always a string
    const cleanedPrompt = String(prompt || "").trim();

    // Validate required fields
    if (!user_id || !title || !idea_id || !cleanedPrompt) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt_id = uuidv4();
    const createdAt = new Date().toISOString();

    try {
        const result = await sql`
            INSERT INTO prompts (prompt_id, idea_id, user_id, type, prompt_text, created_at)
            VALUES (${prompt_id}, ${idea_id}, ${user_id}, 'first-frame', ${cleanedPrompt}, ${createdAt})
            RETURNING *;
        `;
        const newRecord = result[0];
        console.log("✅ New Prompt Record:", newRecord);

        return res.status(200).json({ message: 'POST request received successfully', record: newRecord });
    } catch (error) {
        console.error("❌ Error processing first-frame request:", error);
        return res.status(500).json({ error: "Failed to insert prompt record" });
    }
}
