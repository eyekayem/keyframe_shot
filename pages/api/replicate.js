import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { input } = req.body;

            // Ensure version is always specified
            const modelVersion = "black-forest-labs/flux-1.1-pro:1e4079ea4e5c476e961a2709f9397d949354e098dbcd72a65483946b62a39b1d";

            const prediction = await replicate.run(modelVersion, { input });

            res.status(200).json({ prediction });
        } catch (error) {
            console.error("Replicate API Error:", error);
            res.status(500).json({ error: "Failed to generate image." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
