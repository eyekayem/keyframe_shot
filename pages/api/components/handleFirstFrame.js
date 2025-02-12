// pages/api/components/handleFirstFrame.js
import db from "../../lib/db";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

export async function handleFirstFrame({ idea_id, prompt, frameId }, res) {
    try {
        const modelVersion = "black-forest-labs/flux:1.1-pro";
        console.log("Sending request to Replicate with:", {
            modelVersion,
            prompt,
            webhook: `${process.env.VERCEL_URL}/api/webhook-replicate`
        });

        // Log the prompt being sent to the model
        console.log("Prompt sent to model:", prompt);

        // Submit request to Replicate (Flux Model)
        const prediction = await replicate.run(
            modelVersion, // Ensure correct format
            {
                input: {
                    aspect_ratio: "16:9",
                    output_format: "png",
                    output_quality: 80,
                    prompt,
                    prompt_upsampling: false,
                    safety_tolerance: 5,
                    width: 777
                },
                webhook: `${process.env.VERCEL_URL}/api/webhook-replicate`, // Auto-register webhook
                webhook_events_filter: ["completed"]
            }
        );

        // Log the prompt being written to the database
        console.log("Storing prompt in database:", prompt);

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
}
