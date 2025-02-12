import db from "../../lib/db";
import { v4 as uuidv4 } from "uuid";  // Import UUID generator

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { title, user_id } = req.body;

        // If user_id is not a valid UUID, generate one (temporary fix for now)
        const userId = user_id && user_id.match(/^[0-9a-fA-F-]{36}$/) ? user_id : uuidv4();

        const result = await db.query(
            "INSERT INTO ideas (user_id, title) VALUES ($1, $2) RETURNING id;",
            [userId, title]
        );

        res.status(201).json({ id: result.rows[0].id });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
