// pages/api/components/handleIdea.js
import { v4 as uuidv4 } from "uuid";

export async function handleIdea(req) {
    const { user_id, title } = req.body;
    const ideaId = uuidv4();
    const createdAt = new Date().toISOString();

    // Simulate database interaction
    const newRecord = {
        id: ideaId,
        user_id: user_id,
        title: title,
        created_at: createdAt
    };

    console.log("New DB Record:", newRecord);
    return newRecord;
}
