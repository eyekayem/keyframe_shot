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

    const { input } = req.body;

    const options = {
        model: 'black-forest-labs/flux-1.1-pro-ultra',
        input: input,
        webhook: `${WEBHOOK_HOST}/api/webhooks`,
        webhook_events_filter: ["completed"]
    };

    try {
        const prediction = await replicate.predictions.create(options);

        if (prediction?.error) {
            return res.status(500).json({ detail: prediction.error });
        }

        return res.status(201).json(prediction);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
