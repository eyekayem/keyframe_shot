import { useState } from "react";
import axios from "axios";

export default function CreateIdea() {
    const [title, setTitle] = useState("");
    const [prompt, setPrompt] = useState("");

    const handleSubmit = async () => {
        const response = await axios.post("/api/idea", {
            title,
            user_id: "test-user",
        });
        console.log("Idea Created:", response.data);
    };

    const handleGenerateFirstFrame = async () => {
        const response = await axios.post("/api/first-frame", {
            prompt,
            user_id: "test-user",
        });
        console.log("First Frame Generated:", response.data);
    };

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Idea Title"
            />
            <button onClick={handleSubmit}>Create Idea</button>

            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter Text Prompt"
            />
            <button onClick={handleGenerateFirstFrame}>Send to Flux</button>
        </div>
    );
}
