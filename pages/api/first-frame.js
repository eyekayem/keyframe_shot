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
            // Submit request to Replicate (Flux Model)
            const prediction = await replicate.run(
                "black-forest-labs/flux:1.1-pro", // Ensure correct format
                {
                    input: {
                        aspect_ratio: "16:9",
                        output_format: "png",
                        output_quality: 80,
                        prompt: prompt,
                        prompt_upsampling: false,
                        safety_tolerance: 5,
                        width: 777
                    },
                    webhook: `${process.env.VERCEL_URL}/api/webhook-replicate`, // Auto-register webhook
                    webhook_events_filter: ["completed"]
                }
            );

            // Store the prompt & job ID in the database
            await db.query(`
                INSERT INTO prompts (id, idea_id, type, content, status)
                VALUES ($1, $2, 'image', $3, 'generating')
            `, [frameId, idea_id, JSON.stringify({ prompt, prediction_id: prediction.id })]);

            res.status(201).json({ frameId, predictionId: prediction.id });
        } catch (error) {
            console.error("Replicate API Error:", error);
            res.status(500).json({ error: "Failed to submit image generation." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
