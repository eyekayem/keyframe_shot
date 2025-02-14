import { handleIdea } from "./components/handleIdea";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { user_id, title } = req.body;
    const validUserIds = ['Kenny', 'Rachel', 'Brian', 'banny'];

    // Validate user_id
    if (!validUserIds.includes(user_id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const result = await handleIdea(req);
        return res.status(200).json(result);
    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Failed to record idea" });
    }
}
