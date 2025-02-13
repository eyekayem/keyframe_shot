import { v4 as uuidv4 } from "uuid";
import db from "../../../lib/db";

export async function handleIdea(req) {
    const { user_id, title } = req.body;
    const ideaId = uuidv4();
    const createdAt = new Date().toISOString();

    try {
        const result = await db.query(
            "INSERT INTO ideas (id, user_id, title, created_at) VALUES ($1, $2, $3, $4) RETURNING *;",
            [ideaId, user_id, title, createdAt]
        );

        const newRecord = result.rows[0];
        console.log("New DB Record:", newRecord);
        return newRecord;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to record idea");
    }
}
