import { handleFirstFrame } from "./components/handleFirstFrame";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const ideaData = await handleIdea(req);
        await handleFirstFrame(ideaData, res);
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
