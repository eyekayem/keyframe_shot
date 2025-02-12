import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { input } = req.body;

            // Ensure all required parameters are provided
            if (!input || !input.prompt) {
                return res.status(400).json({ error: "Missing required input fields." });
            }

            const modelVersion = "black-forest-labs/flux-1.1-pro:1e4079ea4e5c476e961a2709f9397d949354e098dbcd72a65483946b62a39b1d";

            // Make API request to Replicate
            const prediction = await replicate.run(modelVersion, {
                input: {
                    aspect_ratio: input.aspect_ratio || "16:9",
                    output_format: input.output_format || "png",
                    output_quality: input.output_quality || 80,
                    prompt: input.prompt,
                    prompt_upsampling: input.prompt_upsampling || false,
                    safety_tolerance: input.safety_tolerance || 5,
                    width: input.width || 777
                }
            });

            res.status(200).json({ prediction });
        } catch (error) {
            console.error("Replicate API Error:", error);
            res.status(500).json({ error: "Failed to generate image." });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
