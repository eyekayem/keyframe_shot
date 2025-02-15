const Replicate = require('replicate');

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

// Prevent caching (if applicable)
replicate.fetch = (url, options) => {
    return fetch(url, { ...options, cache: "no-store" });
};

// Webhook host setup
const WEBHOOK_HOST = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : ''; // Remove NGROK_HOST fallback

if (!WEBHOOK_HOST) {
  throw new Error("Webhook host URL is not set. Ensure VERCEL_URL is defined.");
}

export default async function handler(req, res) {
    console.log("Incoming request body:", req.body); // Log the incoming request body

    const { prompt, lora_weights } = req.body;
    console.log("Parsed prompt:", prompt);
    console.log("Parsed lora_weights:", lora_weights);

    const input = {
        prompt: prompt,
        lora_weights: lora_weights,
        guidance: 3,
        lora_scale: 1,
        megapixels: "1",
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80,
        prompt_strength: 0.8,
        num_inference_steps: 28
    };
    console.log("Constructed input object:", input);

    const options = {
        model: 'black-forest-labs/flux-1.1-pro-ultra',
        input: input,
        webhook: `${WEBHOOK_HOST}/api/webhooks`,
        webhook_events_filter: ["completed"]
    };
    console.log("Constructed options object:", options);

    try {
        const prediction = await replicate.predictions.create(options);
        console.log("Prediction response:", prediction);

        if (prediction?.error) {
            console.error("Prediction error:", prediction.error);
            return res.status(500).json({ detail: prediction.error });
        }

        console.log("Prediction successful:", prediction);
        return res.status(201).json(prediction);
    } catch (error) {
        console.error("Error occurred:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
