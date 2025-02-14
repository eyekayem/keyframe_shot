import { v4 as uuidv4 } from "uuid";
import { neon } from "@neondatabase/serverless";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user_id, title, idea_id } = req.body;
    const validUserIds = ['Kenny', 'Rachel', 'Brian', 'banny'];

    // Ensure `prompt` is always a string
    const prompt = String(req.body.prompt || "").trim();

    console.log("🔍 Debug Prompt Payload:", prompt); // Debugging log

    // Validate user_id
    if (!validUserIds.includes(user_id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (!idea_id) {
        return res.status(400).json({ error: 'Missing idea_id' });
    }

    const sql = neon(process.env.DATABASE_URL);
    const promptId = uuidv4();
    const createdAt = new Date().toISOString();

    try {
        console.log("🚀 Sending request to Replicate with prompt:", prompt);
        const prediction = await replicate.run(
            "black-forest-labs/flux-1.1-pro:1e4079ea4e5c476e961a2709f9397d949354e098dbcd72a65483946b62a39b1d",
            { input: { prompt} }
        );

        console.log("✅ Replicate API Response:", prediction);
        const image_url = prediction.output[0];

        const result = await sql`
            INSERT INTO prompts (id, idea_id, user_id, type, content, created_at)
            VALUES (${promptId}, ${idea_id}, ${user_id}, 'first-frame', ${prompt}, ${createdAt})
            RETURNING *;
        `;
        const newRecord = result[0];
        console.log("✅ New Prompt Record:", newRecord);

        return res.status(200).json({ image_url, newRecord });
    } catch (error) {
        console.error("❌ Error processing first-frame request:", error);
        return res.status(500).json({ error: "Failed to generate first-frame" });
    }
}
