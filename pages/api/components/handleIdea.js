require('dotenv').config();
import { v4 as uuidv4 } from "uuid";
import { neon } from "@neondatabase/serverless";

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Add this line for debugging



export async function handleIdea(req) {
    const { user_id, title } = req.body;
    const ideaId = uuidv4();
    const createdAt = new Date().toISOString();
    const sql = neon(process.env.DATABASE_URL);

    try {
        const result = await sql`
            INSERT INTO ideas (id, user_id, title, created_at)
            VALUES (${ideaId}, ${user_id}, ${title}, ${createdAt})
            RETURNING *;
        `;
        const newRecord = result[0];
        console.log("New DB Record:", newRecord);
        return newRecord;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to record idea");
    }
}
