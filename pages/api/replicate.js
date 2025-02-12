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
  : process.env.NGROK_HOST;

export default async function handler(req, res) {
    if (!process.env.REPLICATE_API_TOKEN) {
        return res.status(500).json({ error: 'The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it.' });
    }

    const { input } = req.body;

    const options = {
        version: '8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f',
        input: { input }
    }

    if (WEBHOOK_HOST) {
        options.webhook = `${WEBHOOK_HOST}/api/webhooks`;
        options.webhook_events_filter = ["start", "completed"];
    }

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
