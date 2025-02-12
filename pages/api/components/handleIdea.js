// pages/api/components/handleIdea.js
import { v4 as uuidv4 } from "uuid";

export async function handleIdea(req) {
    const { idea_id, prompt } = req.body;
    const frameId = uuidv4();

    console.log("Environment Variables:", {
        VERCEL_URL: process.env.VERCEL_URL,
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN ? "Present" : "Not Set"
    });

    return { idea_id, prompt, frameId };
}
