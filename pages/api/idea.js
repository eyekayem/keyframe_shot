import db from "../../lib/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { title, user_id } = req.body;
        const result = await db.query(
            "INSERT INTO ideas (user_id, title) VALUES ($1, $2) RETURNING id;",
            [user_id, title]
        );
        res.status(201).json({ id: result.rows[0].id });
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
