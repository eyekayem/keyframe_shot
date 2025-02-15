import { v4 as uuidv4 } from "uuid";
import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
    console.log("🔍 Request Method:", req.method); // Debugging line

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user_id, title } = req.body;
    const validUserIds = ['Kenny', 'Rachel', 'Brian', 'banny'];

    // Validate user_id
    if (!validUserIds.includes(user_id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const idea_id = uuidv4();
    const createdAt = new Date().toISOString();
    const sql = neon(process.env.DATABASE_URL);

    try {
        const result = await sql`
            INSERT INTO ideas (id, user_id, title, created_at)
            VALUES (${idea_id}, ${user_id}, ${title}, ${createdAt})
            RETURNING *;
        `;
        const newRecord = result[0];
        console.log("New DB Record:", newRecord);
        return res.status(200).json(newRecord);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Failed to record idea" });
    }
}
