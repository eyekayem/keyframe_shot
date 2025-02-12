import db from "../../lib/db";
import Replicate from "replicate";
import { v4 as uuidv4 } from "uuid";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { idea_id, prompt } = req.body;
        const frameId = uuidv4();

        try {
            // Start image generation via Replicate API (Flux model)
            const prediction = await replicate.run(
                "stability-ai/stable-diffusion:latest",
                {
                    input: { prompt },
                    webhook: `${process.env.VERCEL_URL}/api/webhook-replicate`,
                    webhook_events_filter: ["completed"]
                }
            );

            // Store job details in the database
            await db.query(`
                INSERT INTO prompts (id, idea_id, type, content, status)
                VALUES ($1, $2, 'image', $3, 'generating')
            `, [frameId, idea_id, JSON.stringify({ prompt, prediction_id: prediction.id })]);

            res.status(201).json({ frameId, predictionId: prediction.id });
        } catch (error) {
            console.error("Replicate Error:", error);
            res.status(500).json({ error: "Image generation failed." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
