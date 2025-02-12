import db from "../../lib/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id, output, status } = req.body;

        if (status === "succeeded") {
            // Update database with final image URL
            await db.query(`
                UPDATE prompts SET status = 'completed', result_url = $1
                WHERE content->>'prediction_id' = $2
            `, [output[0], id]);

            res.status(200).json({ message: "Image saved." });
        } else if (status === "failed") {
            // Handle failed image generations
            await db.query(`
                UPDATE prompts SET status = 'failed'
                WHERE content->>'prediction_id' = $1
            `, [id]);

            res.status(500).json({ error: "Image generation failed." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
